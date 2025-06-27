// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
// Ensured all original icons are imported, and added FaSignOutAlt for clarity if used
// eslint-disable-next-line no-unused-vars
import { FaShoppingCart, FaUserCircle, FaSearch, FaBars, FaTimes, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { itemHover, buttonClick } from '../utils/animations'; // buttonClick imported as it's used by ClearSearchButton

const StyledHeader = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--dark-card-bg);
  padding: 15px 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
`;

const Logo = styled(Link)`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  transition: all var(--transition-speed);

  &:hover {
    color: var(--accent-color);
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;

  @media (max-width: 992px) {
    display: none;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: var(--text-light);
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  transition: all var(--transition-speed);

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary-color);
    transition: width var(--transition-speed);
  }

  &:hover {
    color: var(--primary-color);
  }

  &:hover::after {
    width: 100%;
  }

  &.active {
    color: var(--primary-color);
    font-weight: 600;
    &::after {
      width: 100%;
    }
  }
`;

const SearchContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 300px;
  width: 100%;

  input {
    width: 100%;
    padding: 8px 10px 8px 35px;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    background-color: var(--input-bg);
    color: var(--text-light);
    font-size: 0.95rem;
    transition: all var(--transition-speed);

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
    }
    // Added padding-right for the clear button
    padding-right: ${props => props.$hasClearButton ? '30px' : '10px'};
  }

  svg {
    position: absolute;
    left: 10px;
    color: var(--text-dark);
  }

  @media (max-width: 768px) {
    display: ${props => props.$mobile ? 'flex' : 'none'};
    margin-top: 15px;
    max-width: 100%;
  }
`;

// New styled component for the clear search button (FaTimes)
const ClearSearchButton = styled(motion.button)`
  position: absolute;
  right: 8px; /* Adjusted position to fit within padding */
  background: none;
  border: none;
  color: var(--text-dark);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-speed);
  z-index: 10; /* Ensure it's above the input */

  &:hover {
    color: var(--primary-color);
    background-color: rgba(var(--primary-color-rgb), 0.1);
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledIconLink = styled(motion.div)`
  position: relative;
  cursor: pointer;
  color: var(--text-light);
  font-size: 1.4rem;
  transition: color var(--transition-speed);

  &:hover {
    color: var(--primary-color);
  }

  span {
    position: absolute;
    top: -5px;
    right: -10px;
    background-color: var(--primary-color);
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    border-radius: 50%;
    padding: 3px 6px;
    line-height: 1;
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  font-size: 1.8rem;
  color: var(--text-light);
  cursor: pointer;

  @media (max-width: 992px) {
    display: block;
    order: 3;
  }
`;

const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MobileMenuContent = styled(motion.div)`
  background-color: var(--dark-card-bg);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  width: 80%;
  max-width: 400px;
  border: 1px solid var(--border-color);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: var(--primary-color);
    transform: rotate(90deg);
  }
`;

const MobileNavLink = styled(NavLink)`
  color: var(--text-light);
  font-size: 1.5rem;
  padding: 10px 0;
  text-align: center;
  transition: color var(--transition-speed), transform var(--transition-speed);

  &:hover {
    color: var(--primary-color);
    transform: translateX(5px);
  }

  &.active {
    color: var(--primary-color);
    font-weight: 700;
  }
`;

const MobileSearchContainer = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    padding: 0 20px;
    margin-bottom: 15px;
  }
`;

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams(); // Hook to access URL search parameters

  // Initialize searchTerm state from URL query parameter 'search'
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Effect to update searchTerm whenever the URL's search parameter changes
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission that would clear the input
    const newSearchParams = new URLSearchParams(searchParams); // Create a new URLSearchParams object based on current ones
    if (searchTerm.trim()) { // If there's actual text in the search bar
      newSearchParams.set('search', searchTerm.trim()); // Set the 'search' parameter
    } else {
      newSearchParams.delete('search'); // If empty, remove the 'search' parameter
    }
    // Navigate to the categories page with the updated search parameters
    navigate(`/categories?${newSearchParams.toString()}`);
    setMobileMenuOpen(false); // Close mobile menu if open after search
  };

  const handleClearSearch = () => {
    setSearchTerm(''); // Clear the input field's state
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search'); // Remove the 'search' parameter from the URL
    // Navigate to categories page to apply the cleared search filter
    navigate(`/categories?${newSearchParams.toString()}`);
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      navigate('/login');
    }
    setMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
    setMobileMenuOpen(false);
  };

  const handleWishlistClick = () => {
    if (isAuthenticated) {
      navigate('/wishlist');
    } else {
      navigate('/login');
    }
    setMobileMenuOpen(false);
  };

  return (
    <StyledHeader
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
    >
      <Logo to="/">Tulunad Store</Logo>

      <Nav>
        <StyledNavLink to="/">Home</StyledNavLink>
        <StyledNavLink to="/categories">Categories</StyledNavLink>
        {isAuthenticated ? (
          <StyledNavLink to="/account">Account</StyledNavLink>
        ) : (
          <>
            <StyledNavLink to="/signup">Signup</StyledNavLink>
            <StyledNavLink to="/login">Login</StyledNavLink>
          </>
        )}
      </Nav>

      {/* Wrapped SearchContainer in a form for consistent submission on Enter */}
      <form onSubmit={handleSearch}>
        <SearchContainer $hasClearButton={searchTerm.length > 0}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm} // Controlled input: value reflects searchTerm state
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state on input change
          />
          {/* Render clear button only if searchTerm is not empty */}
          {searchTerm.length > 0 && (
            <ClearSearchButton onClick={handleClearSearch} type="button" whileTap={buttonClick}>
              <FaTimes />
            </ClearSearchButton>
          )}
        </SearchContainer>
      </form>

      <IconGroup>
        {/* Wishlist Icon */}
        <StyledIconLink
          whileHover={itemHover}
          onClick={handleWishlistClick}
        >
          <FaHeart /> {/* This is the heart symbol you wanted to keep */}
        </StyledIconLink>
        {/* Account/User Icon */}
        <StyledIconLink
          whileHover={itemHover}
          onClick={handleAccountClick}
        >
          <FaUserCircle /> {/* This is the account symbol you wanted to keep */}
        </StyledIconLink>
        {/* Shopping Cart Icon */}
        <StyledIconLink
          whileHover={itemHover}
          onClick={handleCartClick}
        >
          <FaShoppingCart />
          {/* Display cart item count */}
          {cartItems.length > 0 && <span>{cartItems.length}</span>}
        </StyledIconLink>
        {/* Mobile Menu Icon */}
        <MobileMenuIcon onClick={() => setMobileMenuOpen(true)}>
          <FaBars />
        </MobileMenuIcon>
      </IconGroup>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenuOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <MobileMenuContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={() => setMobileMenuOpen(false)}><FaTimes /></CloseButton>
              <MobileSearchContainer>
                {/* Mobile search bar with its own form and clear button */}
                <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex' }}>
                  <SearchContainer $mobile $hasClearButton={searchTerm.length > 0}>
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm.length > 0 && (
                      <ClearSearchButton onClick={handleClearSearch} type="button" whileTap={buttonClick}>
                        <FaTimes />
                      </ClearSearchButton>
                    )}
                  </SearchContainer>
                </form>
              </MobileSearchContainer>
              <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/categories" onClick={() => setMobileMenuOpen(false)}>Categories</MobileNavLink>
              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/account" onClick={() => setMobileMenuOpen(false)}>Account</MobileNavLink>
                  <MobileNavLink to="/wishlist" onClick={() => setMobileMenuOpen(false)}>Wishlist</MobileNavLink>
                  {/* Logout link for mobile menu */}
                  <MobileNavLink to="/" onClick={() => { logout(); setMobileMenuOpen(false); }}>Logout</MobileNavLink>
                </>
              ) : (
                <>
                  <MobileNavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>Signup</MobileNavLink>
                  <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Login</MobileNavLink>
                </>
              )}
            </MobileMenuContent>
          </MobileMenuOverlay>
        )}
      </AnimatePresence>
    </StyledHeader>
  );
}

export default Header;
