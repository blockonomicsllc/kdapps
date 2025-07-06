import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService, { PortfolioData, ApiResponse } from '../services/api';

interface PortfolioContextType {
  portfolio: PortfolioData | null;
  loading: boolean;
  error: string | null;
  refreshPortfolio: () => Promise<void>;
  setTrackedAddress: (address: string) => void;
  trackedAddress: string | null;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackedAddress, setTrackedAddress] = useState<string | null>(null);

  const fetchPortfolio = async (address: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<PortfolioData> = await apiService.getPortfolio(address);
      
      if (response.success && response.data) {
        setPortfolio(response.data);
      } else {
        setError(response.error || 'Failed to fetch portfolio data');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Portfolio fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshPortfolio = async () => {
    if (trackedAddress) {
      await fetchPortfolio(trackedAddress);
    }
  };

  const handleSetTrackedAddress = (address: string) => {
    setTrackedAddress(address);
    fetchPortfolio(address);
  };

  // Auto-refresh portfolio every 30 seconds
  useEffect(() => {
    if (!trackedAddress) return;

    const interval = setInterval(() => {
      refreshPortfolio();
    }, 30000);

    return () => clearInterval(interval);
  }, [trackedAddress]);

  const value: PortfolioContextType = {
    portfolio,
    loading,
    error,
    refreshPortfolio,
    setTrackedAddress: handleSetTrackedAddress,
    trackedAddress,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}; 