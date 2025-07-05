# KaspaTrack Backend Deployment SOP

This guide provides a **step-by-step, beginner-friendly process** for deploying the KaspaTrack backend. Each step includes a brief explanation so anyone—regardless of coding experience—can follow along and understand the purpose behind each action.

---

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Methods](#deployment-methods)
    - [A. WSL/Linux Deployment](#a-wsllinux-deployment)
    - [B. Windows (PowerShell) Deployment](#b-windows-powershell-deployment)
    - [C. Docker Deployment (Recommended for Production)](#c-docker-deployment-recommended-for-production)
4. [Environment Configuration](#environment-configuration)
5. [Testing the Deployment](#testing-the-deployment)
6. [Troubleshooting](#troubleshooting)
7. [Project Structure](#project-structure)

---

## Overview
KaspaTrack Backend is a Rust-based web service. You can deploy it on Windows, Linux, or using Docker. This guide covers all methods, with clear explanations for each step.

---

## Prerequisites
- **For WSL/Linux:**
  - [Rust toolchain](https://rustup.rs/) (provides `cargo` and `rustc`)
- **For Windows:**
  - [Rust toolchain](https://rustup.rs/) (provides `cargo` and `rustc`)
  - PowerShell (comes with Windows)
- **For Docker deployment:**
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

*If you are unsure which method to use, Docker is recommended for production and easiest for consistent results.*

---

## Deployment Methods

### A. WSL/Linux Deployment
**Use this if you have Rust installed on WSL or a Linux machine.**

1. **Open your terminal and navigate to the project directory**
   ```bash
   cd /mnt/c/Users/bless/OneDrive/Documents/kdapps/kaspatrack/kdapps/backend/kaspatrack-backend
   ```
   *// This puts you in the folder containing the backend code.*

2. **Copy the environment template to create your config file**
   ```bash
   cp env.example .env
   ```
   *// This creates a `.env` file for configuration. You can edit it if you want to change the server port or other settings.*

3. **Build the backend (optimized for production)**
   ```bash
   cargo build --release
   ```
   *// This compiles the backend into a fast, standalone executable.*

4. **Run the backend server**
   ```bash
   ./target/release/kaspatrack-backend
   ```
   *// This starts the server. Leave this terminal open to keep it running.*

5. **(Optional) For development, use:**
   ```bash
   cargo run
   ```
   *// This runs the server in development mode (slower, but easier for testing changes).* 

---

### B. Windows (PowerShell) Deployment
**Use this if you have Rust installed on Windows.**

1. **Open PowerShell and navigate to the project directory**
   ```powershell
   cd "C:\Users\bless\OneDrive\Documents\kdapps\kaspatrack\kdapps\backend\kaspatrack-backend"
   ```
   *# This puts you in the backend folder.*

2. **Copy the environment template to create your config file**
   ```powershell
   Copy-Item env.example .env
   ```
   *# This creates a `.env` file for configuration. Edit it if you want to change settings.*

3. **Build and run using the provided script**
   - If you see a script execution error, run PowerShell as Administrator and execute:
     ```powershell
     Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
     ```
     *# This allows local scripts to run. Only needs to be done once.*
   - Then run:
     ```powershell
     .\build.ps1 -Run
     ```
   *# This builds and starts the backend server. Leave this window open to keep it running.*

4. **(Alternative) Build and run manually**
   ```powershell
   cargo build --release
   .\target\release\kaspatrack-backend.exe
   ```
   *# This does the same as the script, but step-by-step.*

---

### C. Docker Deployment (Recommended for Production)
**Use this for the easiest and most reliable deployment, especially on servers.**

1. **Open a terminal and navigate to the backend directory**
   ```bash
   cd /mnt/c/Users/bless/OneDrive/Documents/kdapps/kaspatrack/kdapps/backend/kaspatrack-backend
   ```
   *// Or use the equivalent Windows path in PowerShell.*

2. **Build and start the backend using Docker Compose**
   ```bash
   docker-compose up -d
   ```
   *// This builds the Docker image and starts the backend in the background.*

3. **(Alternative) Build and run manually with Docker**
   ```bash
   docker build -t kaspatrack-backend .
   docker run -d -p 8080:8080 --name kaspatrack-backend kaspatrack-backend
   ```
   *// This does the same as Docker Compose, but step-by-step.*

4. **To stop the backend**
   ```bash
   docker-compose down
   # or
   docker stop kaspatrack-backend && docker rm kaspatrack-backend
   ```
   *// This stops and removes the running backend container.*

---

## Environment Configuration

- The backend uses a `.env` file for configuration.
- To customize, edit `.env` after copying from `env.example`.
- Common settings:
  - `PORT`: The port the server listens on (default: 8080)
  - `HOST`: The network interface (use `0.0.0.0` to allow access from other devices)
  - `RUST_LOG`: Log level (default: info)

---

## Testing the Deployment

1. **Check if the server is running:**
   ```bash
   curl http://localhost:8080/health
   ```
   *// You should see a healthy status response, e.g. `{ "status": "healthy" }`*

2. **Other endpoints:**
   - `http://localhost:8080/api/info` — API information
   - `http://localhost:8080/` — Root endpoint

---

## Troubleshooting
- **Rust not found:** Install from [https://rustup.rs/](https://rustup.rs/) and restart your terminal.
- **Script execution error (Windows):** Set execution policy as shown above.
- **Port already in use:** Change the `PORT` in your `.env` file.
- **Docker issues:** Ensure Docker Desktop is running and you have permissions.
- **Permission denied (Linux/WSL):** Run `chmod +x build.sh` to make scripts executable.

---

## Project Structure
```
kaspatrack-backend/
├── src/
│   └── main.rs          # Main application code
├── Cargo.toml           # Rust project configuration
├── Dockerfile           # Docker build instructions
├── docker-compose.yml   # Docker Compose setup
├── build.sh             # Linux/WSL build script
├── build.ps1            # Windows PowerShell build script
├── env.example          # Environment variable template
├── .env                 # (Created by you) Actual environment config
└── README.md            # This file
```

---

**You are now ready to deploy the KaspaTrack backend!**
- If you have any issues, check the Troubleshooting section above.
- For production, Docker is recommended for reliability and ease of use.
