use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Serialize, Deserialize)]
struct HealthResponse {
    status: String,
    message: String,
}

#[derive(Serialize, Deserialize)]
struct ApiResponse {
    success: bool,
    data: String,
}

async fn health_check() -> impl Responder {
    let response = HealthResponse {
        status: "ok".to_string(),
        message: "KaspaTrack Backend is running".to_string(),
    };
    HttpResponse::Ok().json(response)
}

async fn api_info() -> impl Responder {
    let response = ApiResponse {
        success: true,
        data: "KaspaTrack Backend API v1.0".to_string(),
    };
    HttpResponse::Ok().json(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init();

    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let host = env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    
    let bind_address = format!("{}:{}", host, port);
    
    println!("Starting KaspaTrack Backend server on {}", bind_address);

    HttpServer::new(|| {
        App::new()
            .route("/health", web::get().to(health_check))
            .route("/api/info", web::get().to(api_info))
            .route("/", web::get().to(|| async { "KaspaTrack Backend" }))
    })
    .bind(bind_address)?
    .run()
    .await
} 