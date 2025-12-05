#!/usr/bin/env bash
# Patch dynamically linked binaries in node_modules for NixOS

echo "Patching workerd binary for NixOS..."

# Find the workerd binary
WORKERD_BIN=$(find ./node_modules -path "*/@cloudflare/workerd-linux-64/bin/workerd" -type f -executable 2>/dev/null | head -1)

if [ -z "$WORKERD_BIN" ]; then
    echo "Could not find workerd binary"
    exit 1
fi

echo "Found workerd at: $WORKERD_BIN"

# Check if NIX_CC is set
if [ -z "$NIX_CC" ]; then
    echo "NIX_CC not set, trying to determine dynamic linker..."
    # Try to find the dynamic linker in the system
    DYNAMIC_LINKER=$(find /nix/store -name "ld-linux-x86-64.so.2" 2>/dev/null | head -1)
    if [ -z "$DYNAMIC_LINKER" ]; then
        echo "Could not find dynamic linker"
        exit 1
    fi
else
    DYNAMIC_LINKER=$(cat $NIX_CC/nix-support/dynamic-linker)
fi

echo "Using dynamic linker: $DYNAMIC_LINKER"

# Patch the binary using patchelf
if command -v patchelf >/dev/null 2>&1; then
    patchelf --set-interpreter "$DYNAMIC_LINKER" "$WORKERD_BIN"
    echo "Patched workerd binary with patchelf"
else
    echo "patchelf not found, installing with nix-shell..."
    nix-shell -p patchelf --run "patchelf --set-interpreter '$DYNAMIC_LINKER' '$WORKERD_BIN'"
fi

# Verify the patch
NEW_INTERPRETER=$(readelf -l "$WORKERD_BIN" | grep "Requesting program interpreter" | awk '{print $4}')
echo "New interpreter: $NEW_INTERPRETER"

echo "Done!"
