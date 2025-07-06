# PowerShell script to create .env file for KaspaTrack backend
# This connects to your local testnet node with suffix 10

$envContent = @"
# Server Configuration
PORT=8080
HOST=0.0.0.0
RUST_LOG=info

# Kaspa Network Configuration
KASPA_NETWORK=testnet
KASPA_NETSUFFIX=10
KASPA_WRPC_URL=ws://127.0.0.1:16610

# Address to track (replace with your actual address)
TRACKED_ADDRESS=kaspatest:qrgujp8v59d0r672q80ndcf7glehqy3yv9s4e946jugqysa2puds54zyhfrpz
"@

# Write the content to .env file
$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "✅ Created .env file with local testnet configuration"
Write-Host "📝 Please update TRACKED_ADDRESS with your actual Kaspa address"
Write-Host "🔗 Backend will connect to: ws://127.0.0.1:16610"
Write-Host "🌐 Network: testnet with suffix 10" 