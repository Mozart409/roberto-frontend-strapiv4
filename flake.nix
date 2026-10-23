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
            # The npm prebuilt workerd doesn't run on NixOS; point miniflare at
            # the autopatched one bundled with the wrangler flake.
            export MINIFLARE_WORKERD_PATH="$(find ${wrangler}/lib/node_modules \
              -path '*/@cloudflare/workerd-*/bin/workerd' | head -1)"

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
