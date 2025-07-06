// api.ts - API service for KaspaTrack frontend
// This file defines the TypeScript interfaces and the ApiService class for communicating with the KaspaTrack backend.
// QA/Developers: This is the single point for all HTTP requests to the backend, including portfolio, health, and price endpoints.

// Set the base URL for the backend API, using an environment variable or defaulting to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// PortfolioData describes the shape of portfolio data returned by the backend
export interface PortfolioData {
  address: string; // The Kaspa address being tracked
  kaspa_holdings: number; // The balance for the address
}

// Transaction describes a single transaction (placeholder for future use)
export interface Transaction {
  hash: string;
  amount: number;
  timestamp: string;
  type: 'incoming' | 'outgoing';
}

// ApiResponse is a generic wrapper for all API responses
export interface ApiResponse<T> {
  success: boolean; // Whether the request was successful
  data?: T; // The data returned (if any)
  error?: string; // Error message (if any)
}

// ApiService handles all HTTP requests to the backend
class ApiService {
  private baseUrl: string; // The base URL for the backend

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic request method for all API calls
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`; // Build the full URL
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON response
      return { success: true, data };
    } catch (error) {
      // Log and return error
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get portfolio data for a specific address
  async getPortfolio(address: string): Promise<ApiResponse<PortfolioData>> {
    return this.request<PortfolioData>(`/portfolio/${address}`);
  }

  // Get real-time portfolio updates (placeholder for future use)
  async getPortfolioUpdates(address: string): Promise<ApiResponse<PortfolioData>> {
    return this.request<PortfolioData>(`/portfolio/${address}/updates`);
  }

  // Get transaction history (placeholder for future use)
  async getTransactions(address: string): Promise<ApiResponse<Transaction[]>> {
    return this.request<Transaction[]>(`/transactions/${address}`);
  }

  // Health check endpoint
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Get Kaspa price (placeholder for future use)
  async getKaspaPrice(): Promise<ApiResponse<{ price: number; currency: string }>> {
    return this.request<{ price: number; currency: string }>('/price/kaspa');
  }
}

// Export a singleton instance of the API service
export const apiService = new ApiService();
export default apiService; 