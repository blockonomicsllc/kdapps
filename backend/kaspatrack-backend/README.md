# KaspaTrack Backend

A Rust-based backend service for the KaspaTrack application.

## Features

- Health check endpoint
- Basic API structure
- Docker support
- Environment-based configuration

## Prerequisites

- Rust (latest stable version)
- Docker (optional, for containerized deployment)

## Quick Start

### Local Development

1. **Clone and navigate to the project:**
   ```bash
   cd kaspatrack/backend/kaspatrack-backend
   ```

2. **Build the project:**
   ```bash
   cargo build
   ```

3. **Run the server:**
   ```bash
   cargo run
   ```

   Or use the build script:
   ```bash
   chmod +x build.sh
   ./build.sh --run
   ```

4. **Test the endpoints:**
   - Health check: `http://localhost:8080/health`
   - API info: `http://localhost:8080/api/info`
   - Root: `http://localhost:8080/`

### Docker Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t kaspatrack-backend .
   ```

2. **Run with Docker:**
   ```bash
   docker run -p 8080:8080 kaspatrack-backend
   ```

3. **Or use Docker Compose:**
   ```bash
   docker-compose up -d
   ```

## Environment Variables

Copy `env.example` to `.env` and modify as needed:

```bash
cp env.example .env
```

Available variables:
- `PORT`: Server port (default: 8080)
- `HOST`: Server host (default: 127.0.0.1)
- `RUST_LOG`: Log level (default: info)

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/info` - API information
- `GET /` - Root endpoint

## Deployment

### Production Build

```bash
cargo build --release
```

The optimized binary will be available at `target/release/kaspatrack-backend`.

### Docker Production

```bash
docker build -t kaspatrack-backend:latest .
docker run -d -p 8080:8080 --name kaspatrack-backend kaspatrack-backend:latest
```

## Development

### Adding New Endpoints

1. Add your handler function in `src/main.rs`
2. Register the route in the `App::new()` configuration
3. Test your endpoint

### Project Structure

```
kaspatrack-backend/
├── src/
│   └── main.rs          # Main application entry point
├── Cargo.toml           # Rust project configuration
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── build.sh            # Build script
├── env.example         # Environment variables template
└── README.md           # This file
```

## Troubleshooting

- **Port already in use:** Change the `PORT` environment variable
- **Build errors:** Ensure you have the latest Rust toolchain installed
- **Docker issues:** Make sure Docker is running and you have sufficient permissions 