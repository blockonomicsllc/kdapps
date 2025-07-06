use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use kdapp::proxy::connect_client;
use kaspa_consensus_core::network::{NetworkId, NetworkType};
use kaspa_addresses::Address;
use kaspa_rpc_core::api::rpc::RpcApi;
use kaspa_rpc_core::model::message::GetUtxosByAddressesRequest;

use serde::Serialize;
use std::sync::{Arc, Mutex};
use tokio::sync::Notify;
use std::env;
use serde_json;
use chrono::Utc;
use actix_cors::Cors;
use actix_web::http;

#[derive(Default, Serialize, Clone)]
struct PortfolioData {
    kaspa_holdings: u64,
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init();

    // Load configuration from environment variables
    let network_type = env::var("KASPA_NETWORK").unwrap_or_else(|_| "testnet".to_string());
    let net_suffix: u32 = env::var("KASPA_NETSUFFIX").unwrap_or_else(|_| "10".to_string()).parse().unwrap_or(10);
    let wrpc_url = env::var("KASPA_WRPC_URL").unwrap_or_else(|_| "http://127.0.0.1:16610".to_string());
    let tracked_address = env::var("TRACKED_ADDRESS").unwrap_or_else(|_| {
        "kaspa:qqtquahgzvwucqg5afxlrmzjad30hnclekgrlr3w9ejl9wgregr5jh46ju4tf".to_string()
    });

    log::info!("Starting KaspaTrack backend");
    log::info!("Network: {} with suffix {}", network_type, net_suffix);
    log::info!("wRPC URL: {}", wrpc_url);
    log::info!("Tracking address: {}", tracked_address);

    // Shared state for REST API
    let portfolio = Arc::new(Mutex::new(PortfolioData::default()));
    let notify = Arc::new(Notify::new());

    // Clone for background task
    let portfolio_bg = portfolio.clone();
    let notify_bg = notify.clone();

    // Start background task to listen to Kaspa node and update portfolio
    tokio::spawn(async move {
        // Determine network type - using direct imports from kaspa_consensus_core
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

        let network = NetworkId::with_suffix(network_type_enum, net_suffix);
        log::info!("Connecting to Kaspa network: {:?}", network);

        // Connect to the local node
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

        // Parse the address - Address::constructor returns Address directly, not Result
        let address = Address::constructor(&tracked_address);

        log::info!("Starting portfolio tracking for address: {}", tracked_address);

        loop {
            // Construct the RPC request properly - only addresses field exists
            let request = GetUtxosByAddressesRequest {
                addresses: vec![address.clone()],
            };

            // Get UTXOs for the address using the correct method
            match kaspad.get_utxos_by_addresses_call(None, request).await {
                Ok(response) => {
                    let total: u64 = response.entries.iter().map(|entry| entry.utxo_entry.amount).sum();
                    
                    {
                        let mut p = portfolio_bg.lock().unwrap();
                        p.kaspa_holdings = total;
                    }

                    log::info!("Updated portfolio: {} sompi ({} KAS)", total, total as f64 / 100_000_000.0);
                    notify_bg.notify_waiters();
                }
                Err(e) => {
                    log::error!("Failed to get UTXOs: {}", e);
                }
            }

            // Poll every 10 seconds
            tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
        }
    });

    // REST API endpoint
    let portfolio_api = portfolio.clone();
    let notify_api = notify.clone();

    async fn get_portfolio(
        data: web::Data<(Arc<Mutex<PortfolioData>>, Arc<Notify>)>,
    ) -> impl Responder {
        let (portfolio, notify) = data.get_ref();
        notify.notified().await;
        let p = portfolio.lock().unwrap().clone();
        HttpResponse::Ok().json(p)
    }

    async fn health_check() -> impl Responder {
        HttpResponse::Ok().json(serde_json::json!({
            "status": "ok",
            "timestamp": chrono::Utc::now().to_rfc3339()
        }))
    }

    // Handler for /api/portfolio/{address}
    async fn get_portfolio_by_address(
        path: web::Path<String>,
    ) -> impl Responder {
        let address_str = path.into_inner();
        // Parse the address
        let address = Address::constructor(&address_str);

        // Load configuration for network and node
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

        // Construct the RPC request
        let request = GetUtxosByAddressesRequest {
            addresses: vec![address.clone()],
        };

        // Get UTXOs for the address
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

    // Get server configuration
    let host = env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let bind_addr = format!("{}:{}", host, port);

    log::info!("Starting REST API server on {}", bind_addr);

    // Start REST API
    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST", "OPTIONS"])
                    .allowed_headers(vec![http::header::CONTENT_TYPE])
                    .max_age(3600)
            )
            .app_data(web::Data::new((portfolio_api.clone(), notify_api.clone())))
            .route("/api/portfolio", web::get().to(get_portfolio))
            .route("/health", web::get().to(health_check))
            .route("/api/portfolio/{address}", web::get().to(get_portfolio_by_address))
    })
    .bind(bind_addr)?
    .run()
    .await
}
