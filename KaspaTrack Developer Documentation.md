# 📝 KaspaTrack Developer Documentation

## 1. **Backend: kaspatrack-backend/src/main.rs**
**Purpose:**  
- Main entry point for the Rust backend.
- Connects to the Kaspa node, tracks portfolio balances, and exposes REST API endpoints.

**Key Responsibilities:**
- Loads configuration from environment variables.
- Spawns a background task to poll the Kaspa node for UTXOs and update balances.
- Exposes REST API endpoints:
  - `/api/portfolio` — Returns the latest tracked portfolio (default address).
  - `/api/portfolio/{address}` — Returns the portfolio for any Kaspa address (dynamic, user-driven).
  - `/health` — Health check endpoint for monitoring.
- Handles CORS for frontend integration.

**Critical Sections:**
- **Imports:** All dependencies for web server, Kaspa node, and utilities.
- **PortfolioData struct:** Holds the balance for a Kaspa address.
- **Background Task:** Polls the Kaspa node every 10 seconds for UTXOs.
- **API Handlers:** Functions for each endpoint, including dynamic address lookup.
- **Server Startup:** Configures and starts the Actix-web server.

---

## 2. **Frontend: kaspatrack-frontend/src/App.tsx**
**Purpose:**  
- Main React application file for the KaspaTrack dashboard UI.

**Key Responsibilities:**
- Renders the dashboard, including navigation, stats, charts, and activity feed.
- Integrates with the PortfolioProvider context for state management.
- Provides an input for users to track any Kaspa address.
- Displays live portfolio data and backend connection status.

**Critical Sections:**
- **Imports:** React, context, styles, and input components.
- **navLinks:** Navigation structure for the dashboard.
- **AppContent:** Main UI logic, including stats and rendering.
- **PortfolioInput:** User input for tracking addresses.
- **App:** Wraps everything in the PortfolioProvider context.

---

## 3. **Frontend: kaspatrack-frontend/src/services/api.ts**
**Purpose:**  
- API service layer for all HTTP requests from the frontend to the backend.

**Key Responsibilities:**
- Defines TypeScript interfaces for backend data (PortfolioData, Transaction, ApiResponse).
- Provides methods for:
  - Fetching portfolio data for any address.
  - Health checks.
  - (Placeholders for future: transactions, price, etc.)
- Handles error logging and response parsing.

**Critical Sections:**
- **API_BASE_URL:** Configured via environment variable.
- **PortfolioData interface:** Matches backend response.
- **ApiService class:** All HTTP request logic.
- **Exported apiService:** Singleton instance for use throughout the frontend.

---

## 4. **Frontend: kaspatrack-frontend/src/contexts/PortfolioContext.tsx**
**Purpose:**  
- React context for managing portfolio state and API calls.

**Key Responsibilities:**
- Provides state and actions for portfolio data, loading, errors, and tracked address.
- Handles fetching and refreshing portfolio data from the backend.
- Exposes context to all child components.

**Critical Sections:**
- **PortfolioContextType:** TypeScript interface for context shape.
- **PortfolioProvider:** Context provider with state and logic.
- **usePortfolio:** Custom hook for consuming context.

---

## 5. **Frontend: kaspatrack-frontend/src/components/PortfolioInput.tsx**
**Purpose:**  
- UI component for entering and submitting a Kaspa address to track.

**Key Responsibilities:**
- Renders an input field and submit button.
- Calls context action to set the tracked address and trigger backend fetch.
- Displays error messages if any.

**Critical Sections:**
- **PortfolioInput:** Functional component with local state for address input.
- **Form handling:** Submits address to context.

---

## 6. **Frontend: kaspatrack-frontend/src/App.css**
**Purpose:**  
- Main stylesheet for the KaspaTrack dashboard UI.

**Key Responsibilities:**
- Defines layout, colors, and responsive design for all dashboard components.
- Uses brand colors and modern UI patterns.

---

## 7. **Frontend: kaspatrack-frontend/.env.local**
**Purpose:**  
- Environment configuration for the frontend.

**Key Responsibilities:**
- Sets the backend API URL (`REACT_APP_API_URL`).
- Configures environment and network.

---

# 🗂️ **How Everything Connects**

- **User enters a Kaspa address** in the frontend (`PortfolioInput.tsx`).
- **Frontend context** (`PortfolioContext.tsx`) calls the **API service** (`api.ts`) to fetch data from the backend.
- **Backend** (`main.rs`) connects to the Kaspa node, fetches the real balance, and returns it via the REST API.
- **Frontend UI** (`App.tsx`) displays the live data and updates the dashboard.

---

# 📢 **For QA and New Developers**

- **Start with `App.tsx`** to understand the UI flow.
- **Check `api.ts`** for all backend communication.
- **Review `main.rs`** in the backend for how data is fetched from the blockchain.
- **Use the context and input component** to see how user actions trigger backend calls.

---

If you want a similar summary for any other file or a more detailed walkthrough of any component, just let me know!
