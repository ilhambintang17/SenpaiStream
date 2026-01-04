#!/bin/bash
set -e

# Start warp-svc in background
# In Docker, we might need to manually ensure the directory/socket exists or just run it.
mkdir -p /var/lib/cloudflare-warp
warp-svc &

# Wait for warp-svc to initialize
echo "Waiting for WARP daemon..."
sleep 5

# Register (free account) and Configure
# Check if already registered to avoid error loop
if ! warp-cli --accept-tos registration show | grep -q "Registered"; then
    echo "Registering WARP..."
    warp-cli --accept-tos registration new
fi

# Set mode to proxy (SOCKS5 default port 40000)
echo "Setting WARP mode to proxy..."
warp-cli --accept-tos mode proxy

# Connect
echo "Connecting WARP..."
warp-cli --accept-tos connect

# Verify connection (optional loop)
echo "Waiting for connection..."
sleep 5
warp-cli --accept-tos status

# Set Environment Variables for Node App to use Proxy
export HTTPS_PROXY="socks5://127.0.0.1:40000"
export SOCKS_PROXY="socks5://127.0.0.1:40000"

echo "Starting Application..."
exec "$@"
