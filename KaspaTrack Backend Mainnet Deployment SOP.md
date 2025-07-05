# KaspaTrack Backend Mainnet Deployment SOP
## Complete Production Deployment Guide

---

## 📋 Overview
This document provides step-by-step instructions to deploy KaspaTrack backend on **mainnet** for production use. This is a critical deployment that handles real Kaspa transactions and real money.

---

## ⚠️ **CRITICAL MAINNET CONSIDERATIONS**

### 🔴 **Production vs Testnet Differences**
- **Real money involved** - All transactions are actual Kaspa
- **No test coins** - All balances are real
- **Permanent transactions** - Cannot be reversed
- **Higher security requirements** - Must protect real assets
- **Performance critical** - Must handle production load

### 🛡️ **Security Requirements**
- **Secure server environment** - Not local development
- **Firewall protection** - Restrict access to necessary ports
- **SSL/TLS encryption** - All communications must be encrypted
- **Regular backups** - Protect against data loss
- **Monitoring and logging** - Track all activities

---

## �� Prerequisites
- **Production server** (VPS, cloud instance, or dedicated hardware)
- **Ubuntu 20.04+ or CentOS 8+** server OS
- **Root/sudo access** to server
- **Domain name** (optional but recommended)
- **SSL certificate** (Let's Encrypt or commercial)
- **Firewall configured** (UFW or iptables)
- **Basic Linux administration knowledge**

---

## 🏗️ **MAINNET ARCHITECTURE**

```
Internet → Load Balancer → Backend Server → Kaspa Node → Kaspa Mainnet
                    ↓
              Frontend/API
```

**Production Components:**
1. **Load Balancer** - Distributes traffic (optional)
2. **Backend Server** - Runs KaspaTrack backend
3. **Kaspa Node** - Full mainnet node with UTXO index
4. **Database** - Store historical data (optional)
5. **Monitoring** - Track performance and errors

---

## 🚀 Step-by-Step Mainnet Deployment

### Phase 1: Server Preparation

#### 1.1 Server Requirements
**Minimum Specifications:**
- **CPU**: 4+ cores
- **RAM**: 8GB+ (16GB recommended)
- **Storage**: 500GB+ SSD (Kaspa blockchain is ~100GB+)
- **Network**: 100Mbps+ connection
- **OS**: Ubuntu 20.04 LTS or newer

#### 1.2 Initial Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git build-essential pkg-config libssl-dev

# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Node.js (for potential frontend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 1.3 Security Hardening
```bash
# Configure firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 8080/tcp  # Backend API
sudo ufw allow 16610/tcp  # gRPC
sudo ufw allow 17210/tcp  # wRPC
sudo ufw allow 16111/tcp  # P2P (if running public node)

# Create dedicated user
sudo adduser kaspatrack
sudo usermod -aG sudo kaspatrack
```

---

### Phase 2: Kaspa Node Deployment

#### 2.1 Clone and Build Rusty Kaspa
```bash
# Switch to kaspatrack user
sudo su - kaspatrack

# Clone repository
cd /home/kaspatrack
git clone https://github.com/kaspanet/rusty-kaspa.git
cd rusty-kaspa

# Build optimized version
cargo build --release --bin kaspad
```

#### 2.2 Configure Mainnet Node
```bash
# Create configuration directory
mkdir -p /home/kaspatrack/.rusty-kaspa/kaspa-mainnet

# Create systemd service file
sudo nano /etc/systemd/system/kaspa-node.service
```

**Service file content:**
```ini
[Unit]
Description=Kaspa Mainnet Node
After=network.target

[Service]
Type=simple
User=kaspatrack
WorkingDirectory=/home/kaspatrack/rusty-kaspa
ExecStart=/home/kaspatrack/rusty-kaspa/target/release/kaspad --mainnet --rpclisten=127.0.0.1:16610 --rpclisten-borsh=127.0.0.1:17210 --utxoindex --rpclisten=0.0.0.0:16610 --rpclisten-borsh=0.0.0.0:17210
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

#### 2.3 Start Kaspa Node
```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable kaspa-node
sudo systemctl start kaspa-node

# Check status
sudo systemctl status kaspa-node
sudo journalctl -u kaspa-node -f
```

#### 2.4 Monitor Node Sync
**Expected output:**
```
[INFO] kaspad v1.0.1-fcd9c28
[INFO] Application directory: /home/kaspatrack/.rusty-kaspa
[INFO] Data directory: /home/kaspatrack/.rusty-kaspa/kaspa-mainnet/datadir
[INFO] GRPC Server starting on: 0.0.0.0:16610
[INFO] WRPC Server starting on: 0.0.0.0:17210
[INFO] IBD: Processed X block headers (Y%)
```

**⏱️ Mainnet sync may take 24-48 hours depending on server performance**

---

### Phase 3: Backend Deployment

#### 3.1 Clone and Setup Backend
```bash
# Clone backend repository
cd /home/kaspatrack
git clone https://github.com/your-repo/kaspatrack.git
cd kaspatrack/kdapps/backend/kaspatrack-backend

# Build backend
cargo build --release
```

#### 3.2 Configure Production Environment
```bash
# Create production environment file
nano .env
```

**Production .env configuration:**
```env
# Server Configuration
PORT=8080
HOST=0.0.0.0
RUST_LOG=info

# Kaspa Network Configuration
KASPA_NETWORK=mainnet
KASPA_NETSUFFIX=0
KASPA_WRPC_URL=ws://127.0.0.1:17210

# Production Address to track
TRACKED_ADDRESS=kaspa:your_mainnet_address_here

# Production settings
RUST_LOG=info
```

#### 3.3 Create Backend Service
```bash
# Create systemd service file
sudo nano /etc/systemd/system/kaspatrack-backend.service
```

**Service file content:**
```ini
[Unit]
Description=KaspaTrack Backend
After=network.target kaspa-node.service
Requires=kaspa-node.service

[Service]
Type=simple
User=kaspatrack
WorkingDirectory=/home/kaspatrack/kaspatrack/kdapps/backend/kaspatrack-backend
ExecStart=/home/kaspatrack/kaspatrack/kdapps/backend/kaspatrack-backend/target/release/kaspatrack-backend
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment=RUST_LOG=info

[Install]
WantedBy=multi-user.target
```

#### 3.4 Start Backend Service
```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable kaspatrack-backend
sudo systemctl start kaspatrack-backend

# Check status
sudo systemctl status kaspatrack-backend
sudo journalctl -u kaspatrack-backend -f
```

---

### Phase 4: Reverse Proxy and SSL

#### 4.1 Install Nginx
```bash
sudo apt install -y nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/kaspatrack
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4.2 Enable Site and SSL
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/kaspatrack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificate (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Phase 5: Monitoring and Logging

#### 5.1 Install Monitoring Tools
```bash
# Install monitoring packages
sudo apt install -y htop iotop nethogs

# Install log monitoring
sudo apt install -y logwatch
```

#### 5.2 Create Monitoring Scripts
```bash
# Create health check script
nano /home/kaspatrack/health-check.sh
```

**Health check script:**
```bash
#!/bin/bash

# Check if services are running
if ! systemctl is-active --quiet kaspa-node; then
    echo "Kaspa node is down!"
    systemctl restart kaspa-node
fi

if ! systemctl is-active --quiet kaspatrack-backend; then
    echo "Backend is down!"
    systemctl restart kaspatrack-backend
fi

# Check API response
if ! curl -f http://localhost:8080/api/portfolio > /dev/null 2>&1; then
    echo "API is not responding!"
fi
```

```bash
# Make executable and add to cron
chmod +x /home/kaspatrack/health-check.sh
crontab -e
# Add: */5 * * * * /home/kaspatrack/health-check.sh
```

---

## 🔧 Production Troubleshooting

### Issue 1: Node Sync Issues
**Problem:** Node not syncing or slow sync
**Solutions:**
```bash
# Check disk space
df -h

# Check network connectivity
ping 8.8.8.8

# Check node logs
sudo journalctl -u kaspa-node -f

# Restart node if needed
sudo systemctl restart kaspa-node
```

### Issue 2: Backend Connection Issues
**Problem:** Backend cannot connect to node
**Solutions:**
```bash
# Check if node is running
sudo systemctl status kaspa-node

# Check if wRPC is accessible
curl -i http://localhost:17210

# Check backend logs
sudo journalctl -u kaspatrack-backend -f

# Restart backend
sudo systemctl restart kaspatrack-backend
```

### Issue 3: Performance Issues
**Problem:** Slow response times
**Solutions:**
```bash
# Check system resources
htop
iotop
nethogs

# Check if node is fully synced
# Look for "IBD completed successfully" in logs

# Optimize system
sudo apt install -y tuned
sudo tuned-adm profile throughput-performance
```

---

## 📊 Production Configuration Reference

### Network Configuration
- **Network**: mainnet
- **Suffix**: 0
- **Full Network ID**: mainnet-0

### Port Configuration
- **gRPC Server**: 0.0.0.0:16610
- **wRPC Server**: 0.0.0.0:17210
- **Backend API**: 0.0.0.0:8080
- **Nginx**: 80 (HTTP), 443 (HTTPS)

### Environment Variables
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | 8080 | Backend API port |
| `HOST` | 0.0.0.0 | Listen on all interfaces |
| `KASPA_NETWORK` | mainnet | Kaspa mainnet |
| `KASPA_NETSUFFIX` | 0 | Mainnet suffix |
| `KASPA_WRPC_URL` | ws://127.0.0.1:17210 | Local wRPC connection |
| `TRACKED_ADDRESS` | kaspa:... | Mainnet address to track |

---

## �� Production Success Criteria

### ✅ Infrastructure
- [ ] **Server meets minimum specifications**
- [ ] **Firewall properly configured**
- [ ] **SSL certificate installed and working**
- [ ] **Domain name configured (if applicable)**

### ✅ Kaspa Node
- [ ] **Node running as systemd service**
- [ ] **Fully synced with mainnet**
- [ ] **UTXO index enabled and synced**
- [ ] **wRPC accessible on port 17210**
- [ ] **Auto-restart on failure**

### ✅ Backend Service
- [ ] **Running as systemd service**
- [ ] **Successfully connected to node**
- [ ] **API responding on port 8080**
- [ ] **Auto-restart on failure**
- [ ] **Proper logging configured**

### ✅ Monitoring
- [ ] **Health checks running**
- [ ] **Log monitoring active**
- [ ] **Performance monitoring in place**
- [ ] **Alert system configured**

### ✅ Security
- [ ] **Firewall blocking unnecessary ports**
- [ ] **SSL/TLS encryption active**
- [ ] **Services running as non-root user**
- [ ] **Regular security updates**

---

## 🔄 Production Maintenance

### Daily Tasks
1. **Check service status**
   ```bash
   sudo systemctl status kaspa-node kaspatrack-backend nginx
   ```

2. **Monitor logs**
   ```bash
   sudo journalctl -u kaspa-node --since "1 hour ago"
   sudo journalctl -u kaspatrack-backend --since "1 hour ago"
   ```

3. **Check API response**
   ```bash
   curl -f https://your-domain.com/api/portfolio
   ```

### Weekly Tasks
1. **System updates**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Backup configuration**
   ```bash
   tar -czf backup-$(date +%Y%m%d).tar.gz /home/kaspatrack/.rusty-kaspa /home/kaspatrack/kaspatrack
   ```

3. **Review logs**
   ```bash
   sudo logwatch --mail
   ```

### Monthly Tasks
1. **SSL certificate renewal**
   ```bash
   sudo certbot renew
   ```

2. **Performance review**
   ```bash
   # Check resource usage trends
   # Review error logs
   # Update monitoring thresholds
   ```

---

## 🚨 Emergency Procedures

### Complete System Restart
```bash
# Stop all services
sudo systemctl stop kaspatrack-backend kaspa-node nginx

# Start in order
sudo systemctl start kaspa-node
# Wait for node to be ready
sudo systemctl start kaspatrack-backend
sudo systemctl start nginx
```

### Data Recovery
```bash
# If node data is corrupted
sudo systemctl stop kaspa-node
rm -rf /home/kaspatrack/.rusty-kaspa/kaspa-mainnet/datadir
sudo systemctl start kaspa-node
# Node will resync from scratch
```

### Service Recovery
```bash
# If backend fails
sudo systemctl restart kaspatrack-backend

# If node fails
sudo systemctl restart kaspa-node

# Check logs for errors
sudo journalctl -u kaspatrack-backend -f
sudo journalctl -u kaspa-node -f
```

---

## �� Production Notes

### Critical Differences from Testnet
1. **Real money** - All transactions are actual Kaspa
2. **Higher security** - Must protect real assets
3. **Performance critical** - Must handle production load
4. **Monitoring essential** - Must track all activities
5. **Backup required** - Must protect against data loss

### Performance Optimization
1. **Use SSD storage** - Faster blockchain sync
2. **Adequate RAM** - 16GB+ recommended
3. **Good network** - 100Mbps+ connection
4. **CPU cores** - 4+ cores for better performance
5. **Regular maintenance** - Keep system optimized

### Security Best Practices
1. **Regular updates** - Keep system patched
2. **Firewall rules** - Restrict access to necessary ports
3. **SSL encryption** - Protect all communications
4. **Non-root user** - Run services as dedicated user
5. **Monitoring** - Track all activities and errors

---

## Success Criteria

**Mainnet deployment is successful when:**
1. **All services running as systemd services**
2. **Kaspa node fully synced with mainnet**
3. **Backend successfully connected and responding**
4. **SSL certificate installed and working**
5. **Monitoring and health checks active**
6. **Firewall properly configured**
7. **Regular backups scheduled**
8. **Performance meets requirements**

**This document provides everything needed to deploy KaspaTrack backend on mainnet for production use with enterprise-grade reliability and security.**
