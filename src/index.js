// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Assuming you have AuthContext
import { CartProvider } from './contexts/CartContext'; // Assuming you have CartContext
import { WishlistProvider } from './contexts/WishlistContext'; // New import for WishlistContext
import { Toaster } from 'react-hot-toast'; // Assuming you use react-hot-toast for toasts
import './index.css'; // Assuming you have a global CSS file

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CartProvider>
          {/* WishlistProvider now wraps the App component */}
          <WishlistProvider>
            <App />
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: 'var(--dark-card-bg)',
                  color: 'var(--text-light)',
                  border: '1px solid var(--primary-color)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--primary-color)',
                    secondary: 'var(--dark-card-bg)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'red',
                    secondary: 'var(--dark-card-bg)',
                  },
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
