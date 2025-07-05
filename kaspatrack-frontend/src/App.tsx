import React from 'react';
import './App.css';

const navLinks = [
  { label: 'Portfolio', active: true },
  { label: 'Kaspa' },
  { label: 'Crypto' },
  { label: 'Stocks' },
  { label: 'ETFs' },
  { label: 'Dividends' },
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

function App() {
  return (
    <div className="dashboard-container">
      {/* Header */}
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
        {/* Hero Section */}
        <section className="hero-section slide-in">
          <h1 className="hero-title">KaspaTrack Portfolio</h1>
          <p className="hero-subtitle">
            Decentralized portfolio tracking for Kaspa, crypto, stocks, ETFs & dividends - Zero third-party risk on BlockDAG
          </p>
        </section>

        {/* Stats Grid */}
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

        {/* Chart Section */}
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

        {/* Activity Feed */}
        <section className="activity-section slide-in">
          <div className="activity-header">
            <h2 className="activity-title">Recent Portfolio Activity</h2>
          </div>
          <div className="activity-feed">
            {activities.map((activity, idx) => (
              <div className="activity-item" key={idx}>
                <div className={`activity-dot${activity.pulse ? ' pulse' : ''}`}></div>
                <div className="activity-content">
                  <div className="activity-text">{activity.text}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
                <div className="activity-value">{activity.value}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
