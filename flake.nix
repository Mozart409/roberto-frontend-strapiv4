{
  description = "Development environment for a Node.js project";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    wrangler-flake.url = "github:ryand56/wrangler";
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];

      perSystem = {
        pkgs,
        system,
        ...
      }: let
        wrangler = inputs.wrangler-flake.packages.${system}.wrangler;
        dynamicLinker = "${pkgs.stdenv.cc}/nix-support/dynamic-linker";
      in {
        _module.args.pkgs = import inputs.nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # keep-sorted start
            biome
            caddy
            claude-code
            cocogitto
            dprint
            just
            keep-sorted
            lefthook
            ni
            nodejs_24
            opencode
            podman
            podman-compose
            podman-tui
            python3
            typescript
            # wrangler
            wrangler
            # keep-sorted end
          ];

          shellHook = ''
            # The npm prebuilt workerd expects an FHS loader. Point it at the
            # Nix one so miniflare runs the exact workerd that wrangler pins
            # (the wrangler flake's bundled workerd lags behind). Re-enter the
            # shell after `npm install`, which restores the unpatched binary.
            if [ "$(uname -s)" = Linux ]; then
              find node_modules -path '*/@cloudflare/workerd-linux-*/bin/workerd' \
                -type f 2>/dev/null | while read -r bin; do
                ${pkgs.patchelf}/bin/patchelf \
                  --set-interpreter "$(cat ${dynamicLinker})" "$bin"
              done
            fi

            # Same loader problem for the npm prebuilt biome; its launcher
            # honours BIOME_BINARY, so point it at the Nix build (same version).
            export BIOME_BINARY=${pkgs.biome}/bin/biome

            # Playwright's downloaded browsers don't run on NixOS either; use
            # the nixpkgs build, which must match @playwright/test's version.
            ${pkgs.lib.optionalString pkgs.stdenv.hostPlatform.isLinux ''
              export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
              export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
            ''}

            # stdenv sets SSL_CERT_FILE to a dummy path; workerd then trusts no
            # CA and every outbound fetch fails TLS verification.
            export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt

            lefthook install

            echo "node: $(node -v)"
            echo "npm: $(npm -v)"
            echo "To install dependencies, run: ni or npm install"
          '';
        };

        packages.default = pkgs.writeShellScriptBin "setup-project" ''
          npm install
        '';
      };
    };
}
