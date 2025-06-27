// src/pages/Cart.js
import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { pageTransition, fadeIn, buttonClick } from '../utils/animations';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';

const CartContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: calc(100vh - 160px);
`;

const PageTitle = styled(motion.h1)`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 50px;
  color: var(--primary-color);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CartItemsWrapper = styled.div`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  margin-bottom: 30px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CartItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding-bottom: 25px;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--border-color);

  @media (max-width: 600px) {
    width: 100%;
    height: 200px;
  }
`;

const ItemDetails = styled.div`
  flex-grow: 1;
  h3 {
    font-size: 1.3rem;
    color: var(--text-light);
    margin-bottom: 5px;
  }
  p {
    color: var(--text-dark);
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const ItemPrice = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-color);
  min-width: 80px; /* Ensure price column aligns */
  text-align: right;

  @media (max-width: 600px) {
    width: 100%;
    text-align: left;
    margin-top: 10px;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  overflow: hidden;

  button {
    background-color: var(--input-bg);
    color: var(--text-light);
    border: none;
    padding: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color var(--transition-speed);

    &:hover {
      background-color: var(--primary-color);
    }
    &:disabled {
      background-color: #333;
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
  span {
    padding: 8px 15px;
    color: var(--text-light);
    font-weight: 600;
  }

  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
`;

const RemoveButton = styled(motion.button)`
  background: none;
  border: none;
  color: #ff6b6b; /* Red color for delete */
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform var(--transition-speed);

  &:hover {
    transform: scale(1.1);
    color: #ff4757;
  }

  @media (max-width: 600px) {
    position: absolute; /* Position relative to CartItem if needed */
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
  }
`;

const CartSummary = styled.div`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 20px;

  h2 {
    font-size: 1.8rem;
    color: var(--primary-color);
    margin-bottom: 10px;
    text-align: center;
  }

  p {
    display: flex;
    justify-content: space-between;
    font-size: 1.1rem;
    color: var(--text-light);

    strong {
      color: var(--primary-color);
      font-size: 1.3rem;
    }
  }

  button {
    width: 100%;
  }
`;

const EmptyCartMessage = styled(motion.div)`
  text-align: center;
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 50px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  color: var(--text-dark);
  font-size: 1.2rem;

  p {
    margin-bottom: 20px;
  }

  a {
    display: inline-block;
    background-color: var(--primary-color);
    color: white;
    padding: 12px 25px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-speed);

    &:hover {
      background-color: var(--hover-effect);
      transform: translateY(-2px);
    }
  }
`;

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <CartContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <PageTitle
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Your Shopping Cart
      </PageTitle>

      {cartItems.length === 0 ? (
        <EmptyCartMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>Your cart is empty. Start shopping now!</p>
          <Link to="/categories">Browse Products</Link>
        </EmptyCartMessage>
      ) : (
        <>
          <CartItemsWrapper>
            <AnimatePresence>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <ItemImage src={item.imageUrl} alt={item.name} />
                  <ItemDetails>
                    <h3>{item.name}</h3>
                    <p>Price: ₹{item.price}</p>
                  </ItemDetails>
                  <QuantityControls>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      whileTap={buttonClick}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      whileTap={buttonClick}
                    >
                      <FaPlus />
                    </button>
                  </QuantityControls>
                  <ItemPrice>₹{(item.price * item.quantity).toFixed(2)}</ItemPrice>
                  <RemoveButton
                    onClick={() => removeFromCart(item.id)}
                    whileTap={buttonClick}
                  >
                    <FaTrashAlt />
                  </RemoveButton>
                </CartItem>
              ))}
            </AnimatePresence>
          </CartItemsWrapper>

          <CartSummary>
            <h2>Order Summary</h2>
            <p>Subtotal: <span>₹{getTotalPrice().toFixed(2)}</span></p>
            <p>Shipping: <span>₹50.00</span></p> {/* Dummy shipping */}
            <p><strong>Total:</strong> <strong>₹{(getTotalPrice() + 50).toFixed(2)}</strong></p>
            <Link to="/checkout">
              <motion.button
                whileHover={fadeIn}
                whileTap={buttonClick}
              >
                Proceed to Checkout
              </motion.button>
            </Link>
          </CartSummary>
        </>
      )}
    </CartContainer>
  );
}

export default Cart;