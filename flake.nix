{
  description = "Development environment for a Node.js project";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";
    unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    wrangler-flake.url = "github:ryand56/wrangler";
    playwright.url = "github:pietdevries94/playwright-web-flake";
  };

  outputs = {
    self,
    nixpkgs,
    unstable,
    flake-utils,
    wrangler-flake,
    playwright,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      overlay = final: prev: {
        inherit (playwright.packages.${system}) playwright-test playwright-driver;
      };
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
        overlays = [overlay];
      };
      unstablePkgs = import unstable {inherit system;};
    in {
      # to use other shells, run:
      # nix develop . --command fish
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_24
          dprint
          nodePackages.pnpm
          lazydocker
          ni
          nix-ld
          autoPatchelfHook
          # wrangler
          wrangler-flake.packages.${system}.wrangler
          docker
          docker-compose
          lazydocker
          python3
          caddy
          biome
          pkgs.playwright-test
        ];

        shellHook = ''
          export LD_LIBRARY_PATH=${pkgs.nix-ld}/lib:$LD_LIBRARY_PATH
          export NIX_LD=${pkgs.glibc}/lib/ld-linux-x86-64.so.2
          ./patch-workerd.sh

          export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
          export PLAYWRIGHT_BROWSERS_PATH="${pkgs.playwright-driver.browsers}"

          echo "node: $(node -v)"
          echo "pnpm: $(pnpm -v)"
          echo "To install dependencies, run: ni or pnpm install"

          # Add user to docker group if not already added
          if ! groups $USER | grep -q docker; then
            echo "Note: You may need to add your user to the docker group:"
            echo "sudo usermod -aG docker $USER"
            echo "Then log out and back in, or run: newgrp docker"
          fi
        '';
      };

      packages.default = pkgs.writeShellScriptBin "setup-project" ''
        pnpm install
      '';
    });
}
