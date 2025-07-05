# PowerShell build script for KaspaTrack Backend

param(
    [switch]$Run
)

Write-Host "Building KaspaTrack Backend..." -ForegroundColor Green

# Check if Rust is installed
try {
    $cargoVersion = cargo --version
    Write-Host "Rust found: $cargoVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Rust is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Rust from https://rustup.rs/" -ForegroundColor Yellow
    Write-Host "After installation, restart your terminal and try again." -ForegroundColor Yellow
    exit 1
}

# Build the project
Write-Host "Compiling the project..." -ForegroundColor Yellow
cargo build --release

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host "Binary location: target/release/kaspatrack-backend.exe" -ForegroundColor Cyan
    
    if ($Run) {
        Write-Host "Starting the server..." -ForegroundColor Yellow
        ./target/release/kaspatrack-backend.exe
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
} 