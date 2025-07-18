// App.tsx - Main React application file for KaspaTrack frontend
// This file defines the main dashboard UI, handles portfolio tracking, and integrates with the Portfolio context/provider.
// QA/Developers: This is the entry point for the user interface, where users can input a Kaspa address and view live portfolio data.

// Import React and hooks for building the UI
import React, { useEffect } from 'react';
// Import global styles
import './App.css';
// Import context and input component for portfolio tracking
import { PortfolioProvider, usePortfolio } from './contexts/PortfolioContext';
import PortfolioInput from './components/PortfolioInput';

// Define navigation links for the dashboard
const navLinks = [
  { label: 'Portfolio', active: true }, // Main portfolio tab
  { label: 'Kaspa' }, // Kaspa-specific tab
  { label: 'Crypto' }, // Crypto assets tab
  { label: 'Stocks' }, // Stocks tab
  { label: 'ETFs' }, // ETFs tab
  { label: 'Dividends' }, // Dividends tab
];

const stats = [
  {
    title: 'Total Portfolio Value',
    icon: '💼',
    value: '$127,492',
    change: '+12.4% this month',
    positive: true,
  },
  {
    title: 'Kaspa Holdings',
    icon: '🔸',
    value: '482,500 KAS',
    change: '+8.7% this week',
    positive: true,
  },
  {
    title: 'Crypto Assets',
    icon: '₿',
    value: '$45,280',
    change: '+15.2% this month',
    positive: true,
  },
  {
    title: 'Stocks & ETFs',
    icon: '📈',
    value: '$68,420',
    change: '+6.1% this month',
    positive: true,
  },
  {
    title: 'Dividend Income',
    icon: '💰',
    value: '$2,847',
    change: '+3.2% this quarter',
    positive: true,
  },
  {
    title: 'Decentralized Score',
    icon: '🛡️',
    value: '98.7%',
    change: 'Zero 3rd party risk',
    positive: true,
  },
];

const activities = [
  {
    text: 'Kaspa price updated - decentralized feed',
    time: '2 minutes ago',
    value: '$0.127',
    pulse: true,
  },
  {
    text: 'Dividend received from SCHD ETF',
    time: '1 hour ago',
    value: '+$47.82',
  },
  {
    text: 'Tesla stock price sync complete',
    time: '3 hours ago',
    value: '$248.50',
  },
  {
    text: 'Bitcoin allocation rebalanced',
    time: '6 hours ago',
    value: '2.5 BTC',
  },
  {
    text: 'Portfolio backup to BlockDAG complete',
    time: '12 hours ago',
    value: '✅ Secured',
  },
];

// Main content component for the dashboard
function AppContent() {
  // Use the portfolio context to get state and actions
  const { portfolio, loading, trackedAddress } = usePortfolio();

  // Define the stats to display, using real data if available
  const stats = [
    {
      title: 'Total Portfolio Value',
      icon: '💼',
      // Defensive check: only display value if available
      value: portfolio && portfolio.kaspa_holdings !== undefined ? `${portfolio.kaspa_holdings.toLocaleString()} KAS` : 'N/A',
      change: '+12.4% this month',
      positive: true,
    },
    {
      title: 'Kaspa Holdings',
      icon: '🔸',
      value: portfolio && portfolio.kaspa_holdings !== undefined ? `${portfolio.kaspa_holdings.toLocaleString()} KAS` : 'N/A',
      change: portfolio ? `Last updated: ${new Date().toLocaleTimeString()}` : '+8.7% this week',
      positive: true,
    },
    {
      title: 'Tracked Address',
      icon: '📍',
      value: trackedAddress ? `${trackedAddress.slice(0, 8)}...${trackedAddress.slice(-8)}` : 'Not set',
      change: trackedAddress ? 'Connected to backend' : 'Enter address to track',
      positive: !!trackedAddress,
    },
    {
      title: 'Backend Status',
      icon: '🔗',
      value: loading ? 'Connecting...' : (portfolio ? 'Connected' : 'Disconnected'),
      change: portfolio ? 'Real-time updates' : 'No connection',
      positive: !!portfolio,
    },
    {
      title: 'Crypto Assets',
      icon: '₿',
      value: '$45,280', // Placeholder for future crypto integration
      change: '+15.2% this month',
      positive: true,
    },
    {
      title: 'Decentralized Score',
      icon: '🛡️',
      value: '98.7%', // Placeholder for future analytics
      change: 'Zero 3rd party risk',
      positive: true,
    },
  ];

  // Render the dashboard UI
  return (
    <div className="dashboard-container">
      {/* Header section with logo and navigation */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">K</div>
            <div className="brand-text">KaspaTrack</div>
          </div>
          <nav className="nav-links">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                className={`nav-link${link.active ? ' active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button className="connect-btn">Connect Wallet</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section with title, subtitle, and address input */}
        <section className="hero-section slide-in">
          <h1 className="hero-title">KaspaTrack Portfolio</h1>
          <p className="hero-subtitle">
            Decentralized portfolio tracking for Kaspa, crypto, stocks, ETFs & dividends - Zero third-party risk on BlockDAG
          </p>
          {/* Address input for tracking a portfolio */}
          <PortfolioInput />
        </section>

        {/* Stats Grid - shows portfolio stats */}
        <section className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card slide-in" key={stat.title}>
              <div className="stat-header">
                <span className="stat-title">{stat.title}</span>
                <div className="stat-icon">{stat.icon}</div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change${stat.positive ? '' : ' negative'}`}>
                <span>↗</span>
                <span>{stat.change}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Chart Section - placeholder for future chart integration */}
        <section className="chart-section slide-in">
          <div className="chart-header">
            <h2 className="chart-title">Portfolio Performance</h2>
            <div className="chart-controls">
              <button className="chart-btn active">24H</button>
              <button className="chart-btn">7D</button>
              <button className="chart-btn">30D</button>
              <button className="chart-btn">1Y</button>
            </div>
          </div>
          <div className="chart-placeholder">
            Multi-Asset Portfolio Chart - Hosted on Decentralized BlockDAG
          </div>
        </section>

        {/* Activity Feed - placeholder for recent activity */}
        <section className="activity-section slide-in">
          <div className="activity-header">
            <h2 className="activity-title">Recent Portfolio Activity</h2>
          </div>
          <div className="activity-feed">
            {/* Placeholder activities - replace with real data in future */}
            <div className="activity-item">
              <div className="activity-dot pulse"></div>
              <div className="activity-content">
                <div className="activity-text">Kaspa price updated - decentralized feed</div>
                <div className="activity-time">2 minutes ago</div>
              </div>
              <div className="activity-value">$0.127</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Main App component wraps everything in the PortfolioProvider context
function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}

export default App;
