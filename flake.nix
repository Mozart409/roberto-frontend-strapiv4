{
  description = "Development environment for a Node.js project";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    wrangler-flake.url = "github:ryand56/wrangler";
    playwright.url = "github:pietdevries94/playwright-web-flake";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    wrangler-flake,
    playwright,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };

      upstream = playwright.packages.${system};
      upstreamDriver = upstream.playwright-driver;

      # Fix the upstream webkit package that fails because autoPatchelfHook
      # cannot find libenchant-2.so.2.
      webkitFixed = upstreamDriver.passthru.components.webkit.overrideAttrs (oldAttrs: {
        buildInputs = oldAttrs.buildInputs ++ [ pkgs.enchant_2 ];
      });

      # Re-assemble the browsers bundle with the fixed webkit.
      # The upstream bundle (playwright-driver.browsers) fails because it
      # depends on the broken webkit derivation. We build our own linkFarm
      # matching the exact directory structure Playwright expects.
      browsersJSON = upstreamDriver.passthru.browsersJSON;
      browsersPath = pkgs.linkFarm "playwright-browsers" [
        {
          name = "chromium-${browsersJSON.chromium.revision}";
          path = upstreamDriver.passthru.components.chromium;
        }
        {
          name = "chromium_headless_shell-${browsersJSON.chromium.revision}";
          path = upstreamDriver.passthru.components.chromium-headless-shell;
        }
        {
          name = "firefox-${browsersJSON.firefox.revision}";
          path = upstreamDriver.passthru.components.firefox;
        }
        {
          name = "ffmpeg-${browsersJSON.ffmpeg.revision}";
          path = upstreamDriver.passthru.components.ffmpeg;
        }
        {
          name = "webkit-${browsersJSON.webkit.revision}";
          path = webkitFixed;
        }
      ];
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          # keep-sorted start
          biome
          caddy
          claude-code
          cocogitto
          dprint
          enchant_2
          keep-sorted
          lefthook
          ni
          nodejs_24
          opencode
          podman
          podman-compose
          podman-tui
          python3
          # wrangler
          wrangler-flake.packages.${system}.wrangler
          # keep-sorted end
        ];

        shellHook = ''
          ./patch-workerd.sh

          export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
          export PLAYWRIGHT_BROWSERS_PATH="${browsersPath}"

          lefthook install

          echo "node: $(node -v)"
          echo "npm: $(npm -v)"
          echo "To install dependencies, run: ni or npm install"

          # Add user to docker group if not already added
          if ! groups $USER | grep -q docker; then
            echo "Note: You may need to add your user to the docker group:"
            echo "sudo usermod -aG docker $USER"
            echo "Then log out and back in, or run: newgrp docker"
          fi
        '';
      };

      packages.default = pkgs.writeShellScriptBin "setup-project" ''
        npm install
      '';
    });
}
