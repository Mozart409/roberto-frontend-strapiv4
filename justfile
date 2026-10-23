# https://just.systems

set unstable
set dotenv-load

default:
    just --choose

clear:
    clear || true

[doc("Run `nix flake update` and commit only flake.lock, leaving other unstaged/untracked files alone")]
update: clear
    nix flake update
    git diff --quiet HEAD -- flake.lock || git commit flake.lock -m "chore(deps): update flake.lock"
