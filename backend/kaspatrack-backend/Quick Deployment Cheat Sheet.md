# KaspaTrack Backend - Quick Deployment Cheat Sheet
## One-Page Deployment Guide

---

## 🚀 **QUICK START - 5 MINUTES**

### **1. Start Kaspa Node**
```bash
cd /mnt/c/Users/bless/OneDrive/Documents/kdapps/rusty-kaspa
cargo run --release --bin kaspad -- --testnet --rpclisten=127.0.0.1:16610 --rpclisten-borsh=127.0.0.1:17210 --utxoindex
```
**Wait for:** `[INFO] WRPC Server starting on: 127.0.0.1:17210`

### **2. Start Backend**
```bash
cd /mnt/c/Users/bless/OneDrive/Documents/kdapps/kaspatrack/kdapps/backend/kaspatrack-backend
cargo run
```
**Wait for:** `[INFO] Successfully connected to Kaspa node`

### **3. Test API**
```bash
curl http://127.0.0.1:8080/api/portfolio
```

---

## ⚙️ **CONFIGURATION**

### **Environment File (.env)**
```env
PORT=8080
HOST=127.0.0.1
RUST_LOG=info
KASPA_NETWORK=testnet
KASPA_NETSUFFIX=10
KASPA_WRPC_URL=ws://127.0.0.1:17210
TRACKED_ADDRESS=kaspatest:your_address_here
```

### **Ports Used**
- **gRPC:** 16610
- **wRPC:** 17210  
- **Backend API:** 8080

---

## 🔧 **TROUBLESHOOTING**

### **"URL scheme not supported"**
```bash
# Fix .env file
sed -i 's/http:\/\/127.0.0.1:16610/ws:\/\/127.0.0.1:17210/' .env
```

### **"Address already in use"**
```bash
# Kill existing process
lsof -i :8080
kill -9 <PID>
```

### **"Method unavailable. Run with --utxoindex"**
```bash
# Restart node with UTXO index
cargo run --release --bin kaspad -- --testnet --rpclisten=127.0.0.1:16610 --rpclisten-borsh=127.0.0.1:17210 --utxoindex
```

### **"WebSocket is not connected"**
```bash
# Restart backend
Ctrl+C
cargo run
```

---

## 📋 **SUCCESS INDICATORS**

### **Node Status**
```
[INFO] GRPC Server starting on: 127.0.0.1:16610
[INFO] WRPC Server starting on: 127.0.0.1:17210
[INFO] IBD: Processed X blocks (Y%)
```

### **Backend Status**
```
[INFO] Successfully connected to Kaspa node at ws://127.0.0.1:17210
[INFO] Starting REST API server on 127.0.0.1:8080
[INFO] Updated portfolio: X sompi (X KAS)
```

### **API Response**
```json
{
  "kaspa_holdings": 10000000000000
}
```

---

## 🛑 **STOP SERVICES**

### **Stop Backend**
```bash
Ctrl+C
```

### **Stop Node**
```bash
Ctrl+C
```

---

## �� **RESTART SEQUENCE**

### **1. Stop Everything**
```bash
# Stop backend (Ctrl+C)
# Stop node (Ctrl+C)
```

### **2. Start Node First**
```bash
cd /mnt/c/Users/bless/OneDrive/Documents/kdapps/rusty-kaspa
cargo run --release --bin kaspad -- --testnet --rpclisten=127.0.0.1:16610 --rpclisten-borsh=127.0.0.1:17210 --utxoindex
```

### **3. Start Backend**
```bash
cd /mnt/c/Users/bless/OneDrive/Documents/kdapps/kaspatrack/kdapps/backend/kaspatrack-backend
cargo run
```

---

## 🎯 **QUICK COMMANDS**

### **Check Status**
```bash
# Check if ports are in use
netstat -an | grep -E "(16610|17210|8080)"

# Test API
curl http://127.0.0.1:8080/api/portfolio

# Check node logs
# Look for sync progress in node terminal
```

### **Update Address**
```bash
# Edit .env file
nano .env
# Change TRACKED_ADDRESS=your_new_address
# Restart backend
```

### **Change Network**
```bash
# For mainnet
KASPA_NETWORK=mainnet
KASPA_NETSUFFIX=0
TRACKED_ADDRESS=kaspa:your_mainnet_address

# For testnet-11
KASPA_NETWORK=testnet  
KASPA_NETSUFFIX=11
TRACKED_ADDRESS=kaspatest:your_testnet_address
```

---

## ⚡ **ONE-LINER DEPLOYMENT**

### **Full Deployment Script**
```bash
# Terminal 1: Start Node
cd /mnt/c/Users/bless/OneDrive/Documents/kdapps/rusty-kaspa && cargo run --release --bin kaspad -- --testnet --rpclisten=127.0.0.1:16610 --rpclisten-borsh=127.0.0.1:17210 --utxoindex

# Terminal 2: Start Backend  
cd /mnt/c/Users/bless/OneDrive/Documents/kdapps/kaspatrack/kdapps/backend/kaspatrack-backend && cargo run

# Terminal 3: Test API
curl http://127.0.0.1:8080/api/portfolio
```

---

## 🎉 **DONE!**

**When you see:**
- Node: `[INFO] WRPC Server starting on: 127.0.0.1:17210`
- Backend: `[INFO] Successfully connected to Kaspa node`
- API: `{"kaspa_holdings": X}`

**Your KaspaTrack backend is fully operational!** 🚀
