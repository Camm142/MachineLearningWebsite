import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import pages
import ErrorPage from './components/ErrorPage';
import HomePage from './pages/HomePage';
import PredictPricePage from './pages/PredictPricePage';
import PredictHistory from './pages/PredictHistory';
import MarketCharts from './pages/MarketCharts';
import Calculator from './pages/Calculator';

// Create the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage /> // Shows Error Page if path not found
  },
  {
    path: '/predict-price',
    element: <PredictPricePage />
  },
  {
    path: '/predict-history',
    element: <PredictHistory />
  },
  {
    path: '/market-charts',
    element: <MarketCharts />
  },
  {
    path: '/calculator',
    element: <Calculator />
  }
]);

// Main App component
export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
