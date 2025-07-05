#!/bin/bash

# Build script for KaspaTrack Backend

set -e

echo "Building KaspaTrack Backend..."

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "Error: Rust is not installed. Please install Rust first."
    echo "Visit https://rustup.rs/ for installation instructions."
    exit 1
fi

# Build the project
echo "Compiling the project..."
cargo build --release

echo "Build completed successfully!"
echo "Binary location: target/release/kaspatrack-backend"

# Optional: Run the application
if [ "$1" = "--run" ]; then
    echo "Starting the server..."
    ./target/release/kaspatrack-backend
fi 