// API Service for KaspaTrack Backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface PortfolioData {
  address: string;
  kaspa_holdings: number;
}

export interface Transaction {
  hash: string;
  amount: number;
  timestamp: string;
  type: 'incoming' | 'outgoing';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
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

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
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

  // Get real-time portfolio updates
  async getPortfolioUpdates(address: string): Promise<ApiResponse<PortfolioData>> {
    return this.request<PortfolioData>(`/portfolio/${address}/updates`);
  }

  // Get transaction history
  async getTransactions(address: string): Promise<ApiResponse<Transaction[]>> {
    return this.request<Transaction[]>(`/transactions/${address}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Get Kaspa price
  async getKaspaPrice(): Promise<ApiResponse<{ price: number; currency: string }>> {
    return this.request<{ price: number; currency: string }>('/price/kaspa');
  }
}

export const apiService = new ApiService();
export default apiService; 