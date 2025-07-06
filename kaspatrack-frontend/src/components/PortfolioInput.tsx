import React, { useState } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';

const PortfolioInput: React.FC = () => {
  const [address, setAddress] = useState('');
  const { setTrackedAddress, loading, error } = usePortfolio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setTrackedAddress(address.trim());
    }
  };

  return (
    <div className="portfolio-input">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Kaspa address to track..."
          className="address-input"
          disabled={loading}
        />
        <button type="submit" className="track-btn" disabled={loading || !address.trim()}>
          {loading ? 'Tracking...' : 'Track Portfolio'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PortfolioInput; 