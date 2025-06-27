// src/App.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Categories from './pages/Categories';
import Account from './pages/Account';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import PrivateRoute from './components/PrivateRoute';
import Wishlist from './pages/Wishlist'; // New import for Wishlist page
import styled from 'styled-components'; // Keep this as styled components are used

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  padding-top: 80px;
  overflow: hidden;
  position: relative;
`;

function App() {
  const location = useLocation();

  return (
    <AppContainer>
      <Header />
      <ContentWrapper>
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            {/* Protected routes */}
            <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} /> {/* New Wishlist route */}
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </ContentWrapper>
      <Footer />
    </AppContainer>
  );
}

export default App;
