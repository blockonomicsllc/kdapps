# Use the official Rust image as a builder
FROM rust:1.75 as builder

# Set the working directory
WORKDIR /usr/src/app

# Copy the manifests
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs to build dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies
RUN cargo build --release

# Remove the dummy main.rs and copy the real source code
RUN rm src/main.rs
COPY src ./src

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -u 1001 appuser

# Set the working directory
WORKDIR /app

# Copy the binary from builder stage
COPY --from=builder /usr/src/app/target/release/kaspatrack-backend /app/

# Copy environment file
COPY env.example /app/.env

# Change ownership to the app user
RUN chown -R appuser:appuser /app

# Switch to the app user
USER appuser

# Expose the port
EXPOSE 8080

# Run the binary
CMD ["./kaspatrack-backend"] 