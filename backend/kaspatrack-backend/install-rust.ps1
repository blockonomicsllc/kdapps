# PowerShell script to install Rust on Windows

Write-Host "Installing Rust for KaspaTrack Backend..." -ForegroundColor Green

# Check if Rust is already installed
try {
    $cargoVersion = cargo --version
    Write-Host "Rust is already installed: $cargoVersion" -ForegroundColor Green
    Write-Host "You can now run: .\build.ps1" -ForegroundColor Cyan
    exit 0
} catch {
    Write-Host "Rust not found. Installing..." -ForegroundColor Yellow
}

# Download and run rustup-init
Write-Host "Downloading Rust installer..." -ForegroundColor Yellow
$rustupUrl = "https://win.rustup.rs/x86_64"
$rustupPath = "$env:TEMP\rustup-init.exe"

try {
    Invoke-WebRequest -Uri $rustupUrl -OutFile $rustupPath
    Write-Host "Download completed. Running installer..." -ForegroundColor Green
    
    # Run the installer with default settings
    Start-Process -FilePath $rustupPath -ArgumentList "--default-toolchain", "stable", "--profile", "default", "-y" -Wait
    
    Write-Host "Rust installation completed!" -ForegroundColor Green
    Write-Host "Please restart your terminal/PowerShell and then run: .\build.ps1" -ForegroundColor Cyan
    
    # Clean up
    Remove-Item $rustupPath -Force
    
} catch {
    Write-Host "Failed to download Rust installer." -ForegroundColor Red
    Write-Host "Please manually install Rust from: https://rustup.rs/" -ForegroundColor Yellow
    exit 1
} 