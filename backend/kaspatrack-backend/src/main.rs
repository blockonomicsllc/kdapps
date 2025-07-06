// Import necessary crates and modules for web server, Kaspa node connection, and utilities
use actix_web::{web, App, HttpResponse, HttpServer, Responder}; // Actix-web for REST API
use kdapp::proxy::connect_client; // Custom proxy to connect to Kaspa node
use kaspa_consensus_core::network::{NetworkId, NetworkType}; // Kaspa network types
use kaspa_addresses::Address; // Kaspa address type
use kaspa_rpc_core::api::rpc::RpcApi; // Kaspa RPC API
use kaspa_rpc_core::model::message::GetUtxosByAddressesRequest; // Kaspa UTXO request model

use serde::Serialize; // For serializing structs to JSON
use std::sync::{Arc, Mutex}; // For thread-safe shared state
use tokio::sync::Notify; // For async notifications
use std::env; // For reading environment variables
use serde_json; // For JSON serialization
use chrono::Utc; // For timestamps
use actix_cors::Cors; // For CORS middleware
use actix_web::http; // For HTTP headers

// PortfolioData holds the balance for a Kaspa address
#[derive(Default, Serialize, Clone)]
struct PortfolioData {
    kaspa_holdings: u64, // Total KAS held by the tracked address
}

// Main entry point for the backend
#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables from .env file
    dotenv::dotenv().ok();
    // Initialize logger
    env_logger::init();

    // Load configuration from environment variables
    let network_type = env::var("KASPA_NETWORK").unwrap_or_else(|_| "testnet".to_string()); // Network type (mainnet/testnet)
    let net_suffix: u32 = env::var("KASPA_NETSUFFIX").unwrap_or_else(|_| "10".to_string()).parse().unwrap_or(10); // Network suffix
    let wrpc_url = env::var("KASPA_WRPC_URL").unwrap_or_else(|_| "http://127.0.0.1:16610".to_string()); // Kaspa node URL
    let tracked_address = env::var("TRACKED_ADDRESS").unwrap_or_else(|_| {
        // Default address if not set
        "kaspa:qqtquahgzvwucqg5afxlrmzjad30hnclekgrlr3w9ejl9wgregr5jh46ju4tf".to_string()
    });

    // Log startup info
    log::info!("Starting KaspaTrack backend");
    log::info!("Network: {} with suffix {}", network_type, net_suffix);
    log::info!("wRPC URL: {}", wrpc_url);
    log::info!("Tracking address: {}", tracked_address);

    // Shared state for REST API (portfolio and notification)
    let portfolio = Arc::new(Mutex::new(PortfolioData::default()));
    let notify = Arc::new(Notify::new());

    // Clone for background task
    let portfolio_bg = portfolio.clone();
    let notify_bg = notify.clone();

    // Start background task to listen to Kaspa node and update portfolio
    tokio::spawn(async move {
        // Determine network type
        let network_type_enum = match network_type.to_lowercase().as_str() {
            "mainnet" => NetworkType::Mainnet,
            "testnet" => NetworkType::Testnet,
            "devnet" => NetworkType::Devnet,
            "simnet" => NetworkType::Simnet,
            _ => {
                log::warn!("Unknown network type '{}', defaulting to testnet", network_type);
                NetworkType::Testnet
            }
        };

        // Create network ID
        let network = NetworkId::with_suffix(network_type_enum, net_suffix);
        log::info!("Connecting to Kaspa network: {:?}", network);

        // Connect to the local Kaspa node
        let kaspad = match connect_client(network, Some(wrpc_url.clone())).await {
            Ok(client) => {
                log::info!("Successfully connected to Kaspa node at {}", wrpc_url);
                client
            }
            Err(e) => {
                log::error!("Failed to connect to Kaspa node: {}", e);
                return;
            }
        };

        // Parse the address to track
        let address = Address::constructor(&tracked_address);
        log::info!("Starting portfolio tracking for address: {}", tracked_address);

        // Main loop: poll the Kaspa node every 10 seconds
        loop {
            // Build the UTXO request for the address
            let request = GetUtxosByAddressesRequest {
                addresses: vec![address.clone()],
            };

            // Query the Kaspa node for UTXOs
            match kaspad.get_utxos_by_addresses_call(None, request).await {
                Ok(response) => {
                    // Sum all UTXOs to get the total balance
                    let total: u64 = response.entries.iter().map(|entry| entry.utxo_entry.amount).sum();
                    {
                        let mut p = portfolio_bg.lock().unwrap();
                        p.kaspa_holdings = total;
                    }
                    log::info!("Updated portfolio: {} sompi ({} KAS)", total, total as f64 / 100_000_000.0);
                    notify_bg.notify_waiters(); // Notify any waiting API requests
                }
                Err(e) => {
                    log::error!("Failed to get UTXOs: {}", e);
                }
            }
            // Wait 10 seconds before polling again
            tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
        }
    });

    // REST API endpoint shared state
    let portfolio_api = portfolio.clone();
    let notify_api = notify.clone();

    // Handler for /api/portfolio (returns the latest tracked portfolio)
    async fn get_portfolio(
        data: web::Data<(Arc<Mutex<PortfolioData>>, Arc<Notify>)>,
    ) -> impl Responder {
        let (portfolio, notify) = data.get_ref();
        notify.notified().await; // Wait for portfolio update
        let p = portfolio.lock().unwrap().clone();
        HttpResponse::Ok().json(p)
    }

    // Health check endpoint for monitoring
    async fn health_check() -> impl Responder {
        HttpResponse::Ok().json(serde_json::json!({
            "status": "ok",
            "timestamp": chrono::Utc::now().to_rfc3339()
        }))
    }

    // Handler for /api/portfolio/{address} (returns portfolio for any address)
    async fn get_portfolio_by_address(
        path: web::Path<String>,
    ) -> impl Responder {
        let address_str = path.into_inner(); // Get address from URL
        let address = Address::constructor(&address_str); // Parse address

        // Load config for network and node
        let network_type = env::var("KASPA_NETWORK").unwrap_or_else(|_| "testnet".to_string());
        let net_suffix: u32 = env::var("KASPA_NETSUFFIX").unwrap_or_else(|_| "10".to_string()).parse().unwrap_or(10);
        let wrpc_url = env::var("KASPA_WRPC_URL").unwrap_or_else(|_| "http://127.0.0.1:16610".to_string());

        // Determine network type
        let network_type_enum = match network_type.to_lowercase().as_str() {
            "mainnet" => NetworkType::Mainnet,
            "testnet" => NetworkType::Testnet,
            "devnet" => NetworkType::Devnet,
            "simnet" => NetworkType::Simnet,
            _ => NetworkType::Testnet,
        };
        let network = NetworkId::with_suffix(network_type_enum, net_suffix);

        // Connect to the Kaspa node
        let kaspad = match connect_client(network, Some(wrpc_url.clone())).await {
            Ok(client) => client,
            Err(e) => {
                return HttpResponse::InternalServerError().body(format!("Failed to connect to Kaspa node: {}", e));
            }
        };

        // Build the UTXO request for the address
        let request = GetUtxosByAddressesRequest {
            addresses: vec![address.clone()],
        };

        // Query the Kaspa node for UTXOs
        match kaspad.get_utxos_by_addresses_call(None, request).await {
            Ok(response) => {
                let total: u64 = response.entries.iter().map(|entry| entry.utxo_entry.amount).sum();
                HttpResponse::Ok().json(serde_json::json!({
                    "address": address_str,
                    "kaspa_holdings": total
                }))
            }
            Err(e) => {
                HttpResponse::InternalServerError().body(format!("Failed to get UTXOs: {}", e))
            }
        }
    }

    // Get server configuration (host and port)
    let host = env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let bind_addr = format!("{}:{}", host, port);

    log::info!("Starting REST API server on {}", bind_addr);

    // Start REST API server
    HttpServer::new(move || {
        App::new()
            // Enable CORS for frontend development
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST", "OPTIONS"])
                    .allowed_headers(vec![http::header::CONTENT_TYPE])
                    .max_age(3600)
            )
            // Share state with handlers
            .app_data(web::Data::new((portfolio_api.clone(), notify_api.clone())))
            // Register API routes
            .route("/api/portfolio", web::get().to(get_portfolio))
            .route("/health", web::get().to(health_check))
            .route("/api/portfolio/{address}", web::get().to(get_portfolio_by_address))
    })
    .bind(bind_addr)?
    .run()
    .await
}
