# KaspaTrack Backend Deployment SOP
## Complete Guide for Non-Coders

---

## 📋 Overview
This document provides step-by-step instructions to deploy KaspaTrack backend on testnet-10 using the kdapp framework. The backend tracks Kaspa addresses and provides portfolio data via a REST API.

---

## 🎯 Prerequisites
- Windows 10/11 with WSL2 (Ubuntu) installed
- Git installed
- Rust toolchain installed
- Basic terminal knowledge

---

## �� Project Structure
```
kdapps/
├── kaspatrack/
│   └── kdapps/
│       ├── backend/
│       │   └── kaspatrack-backend/     # Backend application
│       └── frontend/                   # Frontend application
└── rusty-kaspa/                        # Kaspa node software
```

---

## 🚀 Step-by-Step Deployment

### Step 1: Clone and Setup Projects

#### 1.1 Clone the repositories
```bash
# Navigate to your documents folder
cd /mnt/c/Users/bless/OneDrive/Documents/kdapps

# Clone KaspaTrack backend
git clone https://github.com/your-repo/kaspatrack.git

# Clone Rusty Kaspa (if not already present)
git clone https://github.com/kaspanet/rusty-kaspa.git
```

#### 1.2 Navigate to backend directory
```bash
cd kaspatrack/kdapps/backend/kaspatrack-backend
```

---

### Step 2: Configure Environment

#### 2.1 Create environment file
```bash
# Copy the example environment file
cp env.example .env
```

#### 2.2 Edit environment configuration
```bash
# Open the .env file for editing
nano .env
```

#### 2.3 Configure the following settings:
```env
# Server Configuration
PORT=8080
HOST=127.0.0.1
RUST_LOG=info

# Kaspa Network Configuration
KASPA_NETWORK=testnet
KASPA_NETSUFFIX=10
KASPA_WRPC_URL=ws://127.0.0.1:17210

# Address to track (replace with your actual address)
TRACKED_ADDRESS=kaspatest:your_testnet_address_here
```

**⚠️ CRITICAL: Use `ws://` NOT `http://` for the wRPC URL**

---

### Step 3: Start Kaspa Node

#### 3.1 Navigate to Rusty Kaspa directory
```bash
cd /mnt/c/Users/bless/OneDrive/Documents/kdapps/rusty-kaspa
```

#### 3.2 Start Kaspa node with required flags
```bash
cargo run --release --bin kaspad -- --testnet --rpclisten=127.0.0.1:16610 --rpclisten-borsh=127.0.0.1:17210 --utxoindex
```

#### 3.3 Wait for node to start
**Expected output:**
```
[INFO] GRPC Server starting on: 127.0.0.1:16610
[INFO] WRPC Server starting on: 127.0.0.1:17210
[INFO] Resyncing the utxoindex...
```

**⏱️ First startup may take 5-10 minutes for initial sync**

---

### Step 4: Deploy Backend

#### 4.1 Navigate to backend directory
```bash
cd /mnt/c/Users/bless/OneDrive/Documents/kdapps/kaspatrack/kdapps/backend/kaspatrack-backend
```

#### 4.2 Build and run backend
```bash
cargo run
```

#### 4.3 Verify successful deployment
**Expected output:**
```
[INFO] Starting KaspaTrack backend
[INFO] Network: testnet with suffix 10
[INFO] wRPC URL: ws://127.0.0.1:17210
[INFO] Successfully connected to Kaspa node at ws://127.0.0.1:17210
[INFO] Starting REST API server on 127.0.0.1:8080
[INFO] Updated portfolio: X sompi (X KAS)
```

---

### Step 5: Test Deployment

#### 5.1 Test API endpoint
Open browser and navigate to:
```
http://127.0.0.1:8080/api/portfolio
```

#### 5.2 Expected response
```json
{
  "kaspa_holdings": 10000000000000
}
```

---

## 🔧 Troubleshooting Guide

### Issue 1: "URL scheme not supported"
**Problem:** Backend shows WebSocket connection error
**Solution:** Ensure `.env` file uses `ws://` not `http://` in `KASPA_WRPC_URL`

### Issue 2: "Address already in use"
**Problem:** Port 8080 is occupied
**Solution:** 
```bash
# Find and kill existing process
lsof -i :8080
kill -9 <PID>
```

### Issue 3: "Method unavailable. Run the node with --utxoindex"
**Problem:** Node missing UTXO index
**Solution:** Restart node with `--utxoindex` flag

### Issue 4: "WebSocket is not connected"
**Problem:** Connection drops after initial success
**Solution:** Restart backend with `cargo run`

### Issue 5: "Address contains invalid character"
**Problem:** Incorrect address format
**Solution:** Use correct format:
- **Testnet**: `kaspatest:address_here`
- **Mainnet**: `kaspa:address_here`

---

## 📊 Configuration Reference

### Port Configuration
- **gRPC Server**: 127.0.0.1:16610
- **wRPC Server**: 127.0.0.1:17210
- **Backend API**: 127.0.0.1:8080

### Network Configuration
- **Network**: testnet
- **Suffix**: 10
- **Full Network ID**: testnet-10

### Environment Variables
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | 8080 | Backend API port |
| `HOST` | 127.0.0.1 | Backend API host |
| `KASPA_NETWORK` | testnet | Kaspa network type |
| `KASPA_NETSUFFIX` | 10 | Network suffix |
| `KASPA_WRPC_URL` | ws://127.0.0.1:17210 | WebSocket RPC URL |
| `TRACKED_ADDRESS` | kaspatest:... | Address to track |

---

## 🎯 Key Success Indicators

### ✅ Node Status
- [ ] GRPC Server running on 127.0.0.1:16610
- [ ] WRPC Server running on 127.0.0.1:17210
- [ ] Node syncing and processing blocks
- [ ] UTXO index enabled

### ✅ Backend Status
- [ ] Successfully connected to Kaspa node
- [ ] HTTP server running on 127.0.0.1:8080
- [ ] Portfolio updates every 10 seconds
- [ ] API endpoint responding with JSON

### ✅ API Response
- [ ] `http://127.0.0.1:8080/api/portfolio` returns JSON
- [ ] Portfolio data shows actual balance
- [ ] No connection errors in logs

---

## 🔄 Maintenance

### Daily Checks
1. Verify node is running and synced
2. Check backend logs for errors
3. Test API endpoint response
4. Monitor portfolio updates

### Restart Procedures
```bash
# Restart node
Ctrl+C (stop node)
cargo run --release --bin kaspad -- --testnet --rpclisten=127.0.0.1:16610 --rpclisten-borsh=127.0.0.1:17210 --utxoindex

# Restart backend
Ctrl+C (stop backend)
cargo run
```

---

## 📝 Notes for Non-Coders

### Important Commands to Remember
- `cargo run` - Build and run Rust applications
- `Ctrl+C` - Stop running processes
- `nano .env` - Edit configuration files
- `lsof -i :8080` - Check what's using port 8080

### Critical Configuration Points
1. **Always use `ws://` for wRPC URL** - `http://` will cause connection errors
2. **Use correct address format** - testnet addresses start with `kaspatest:`
3. **Include `--utxoindex` flag** - Required for portfolio tracking
4. **Use separate ports** - gRPC on 16610, wRPC on 17210

### Common Mistakes to Avoid
- ❌ Using `http://` instead of `ws://` in wRPC URL
- ❌ Forgetting `--utxoindex` flag on node startup
- ❌ Using wrong address format (double `kaspa:` prefix)
- ❌ Running multiple instances on same port

---

🏗️ WHY A KASPA NODE IS REQUIRED
🔍 Core Understanding: Backend Cannot Work Without a Node
The KaspaTrack backend cannot function independently. It requires a Kaspa node because:
1. Data Source Requirement
Backend needs real-time blockchain data to track addresses
Only a Kaspa node can provide this data - it's the authoritative source
No external APIs or services can replace this requirement
2. UTXO (Unspent Transaction Output) Access
Portfolio tracking requires UTXO data - what coins an address owns
Only a synced node can provide UTXO information
Backend queries the node every 10 seconds for updated balance
3. Network Connectivity
Backend connects to the Kaspa network through the node
Node validates and processes transactions from the network
Backend acts as a "client" to the node's "server"
4. Real-time Updates
Node receives new blocks and transactions from the network
Backend polls the node for address balance changes
Without node = no real-time data

## �� Success Criteria

**Deployment is successful when:**
1. Kaspa node runs without errors
2. Backend connects to node successfully
3. API endpoint returns portfolio data
4. No connection errors in logs
5. Portfolio updates every 10 seconds

**This document provides everything needed to deploy KaspaTrack backend on testnet-10, even for users with no coding experience.**
