// tulunad-backend/server.js

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors'); // Import CORS middleware

// Import your API routes
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders'); // Correctly import order routes

const app = express();
const PORT = process.env.PORT || 5000; // Define the port for the server

// --- Middleware ---

// CORS configuration: Allow requests only from your React frontend.
// This is important for security and to prevent cross-origin issues.
// In production, replace 'http://localhost:3000' with your actual frontend domain.
app.use(cors({
  origin: 'http://localhost:3000' // Your React app's development server
}));

// Express middleware to parse JSON request bodies
// This allows you to receive JSON data sent from your frontend (e.g., in POST requests)
app.use(express.json());

// --- API Routes ---

// Mount your route handlers under specific base paths
// Requests to /api/products will be handled by productRoutes
app.use('/api/products', productRoutes);
// Requests to /api/auth will be handled by authRoutes (e.g., /api/auth/login, /api/auth/register)
app.use('/api/auth', authRoutes);
// Requests to /api/orders will be handled by orderRoutes (e.g., /api/orders, /api/orders/user)
app.use('/api/orders', orderRoutes);

// --- Basic Root Route ---

// A simple GET route for the root URL to confirm the server is running
app.get('/', (req, res) => {
  res.send('Tulunad Store Backend API is running!');
});

// --- Error Handling Middleware ---

// This middleware catches any errors that occur in your routes or other middleware.
// It helps prevent your server from crashing and provides a generic error response.
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging purposes
  res.status(500).send('Something broke!'); // Send a generic 500 status response
});

// --- Start the Server ---

// Make the Express app listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});