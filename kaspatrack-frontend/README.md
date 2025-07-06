# KaspaTrack Frontend

A React-based frontend for the KaspaTrack portfolio tracking application. This frontend connects to the KaspaTrack backend to display real-time portfolio data for Kaspa addresses.

## Features

- Real-time portfolio tracking
- Address input and validation
- Live balance updates
- Transaction history display
- Responsive design with your brand colors (#70C7BA and #F7931A)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend Connection
Copy the example environment file and update it with your backend URL:

```bash
cp env.example .env.local
```

Edit `.env.local` and set your backend URL:
```
REACT_APP_API_URL=http://localhost:8080
```

### 3. Start the Development Server
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Connecting to Backend

1. Make sure your KaspaTrack backend is running (see backend README)
2. Enter a Kaspa address in the input field
3. Click "Track Portfolio" to start monitoring
4. The dashboard will show real-time balance and transaction data

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8080)
- `REACT_APP_ENV` - Environment (development/production)
- `REACT_APP_KASPA_NETWORK` - Kaspa network (testnet-10/mainnet)

## Architecture

- **API Service** (`src/services/api.ts`) - Handles backend communication
- **Portfolio Context** (`src/contexts/PortfolioContext.tsx`) - State management
- **Components** - Reusable UI components
- **App.tsx** - Main application component

## Troubleshooting

- **Connection Error**: Make sure your backend is running and the API URL is correct
- **CORS Issues**: Ensure your backend allows requests from localhost:3000
- **Address Not Found**: Verify the Kaspa address format and network

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
