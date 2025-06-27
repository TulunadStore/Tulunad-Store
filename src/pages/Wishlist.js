// src/pages/Wishlist.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { pageTransition, fadeIn, buttonClick } from '../utils/animations';
import { FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa'; // Removed FaRegHeart
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const WishlistContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1200px;
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

const BackButton = styled(motion.button)`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 8px;
  transition: all var(--transition-speed);

  &:hover {
    background-color: var(--input-bg);
    transform: translateX(-5px);
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
`;

const ProductCard = styled(motion.div)`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-speed);
  border: 1px solid var(--border-color);
  perspective: 1000px;
  position: relative;

  &:hover {
    transform: translateY(-5px) rotateX(2deg);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color);
  transition: transform 0.4s ease-in-out;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 20px;
  h3 {
    font-size: 1.3rem;
    margin-bottom: 10px;
    color: var(--text-light);
  }
  p {
    color: var(--text-dark);
    font-size: 0.9rem;
    margin-bottom: 15px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span {
    display: block;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 15px;
  }
`;

// This button serves as the clickable area for the heart icon
const WishlistButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: transparent; /* Keep background transparent */
  border: none; /* Remove any border */
  cursor: pointer;
  z-index: 2;
  width: 48px; /* Slightly larger clickable area than icon */
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  transition: transform var(--transition-speed); /* Add transition for hover effect */

  /* Style the Font Awesome heart icon directly */
  svg {
    font-size: 2rem; /* Size of the heart icon */
    color: var(--primary-color); /* Always pink */
    filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.2)); /* Subtle shadow for depth */
    transition: all var(--transition-speed);
  }

  &:hover {
    transform: scale(1.1); /* Enlarge clickable area and icon on hover */
    svg {
      color: var(--hover-effect); /* Change color slightly on hover */
    }
  }
`;

const ActionButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all var(--transition-speed);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;

  &:hover {
    background-color: var(--hover-effect);
    transform: translateY(-2px);
  }
`;

const EmptyWishlistMessage = styled(motion.div)`
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

function Wishlist() {
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist(); // wishlistItems provides the active state
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    navigate('/checkout');
    toast.success('Moving to checkout!');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <WishlistContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <BackButton
        onClick={() => navigate(-1)}
        whileHover={fadeIn}
        whileTap={buttonClick}
      >
        <FaArrowLeft /> Back
      </BackButton>

      <PageTitle
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Your Wishlist
      </PageTitle>

      {wishlistItems.length === 0 ? (
        <EmptyWishlistMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>Your wishlist is empty. Start adding items!</p>
          <Link to="/categories">Browse Products</Link>
        </EmptyWishlistMessage>
      ) : (
        <ProductGrid>
          {wishlistItems.map((product, index) => (
            <ProductCard
              key={product.id}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                initial: { opacity: 0, y: 50 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } },
              }}
            >
              <Link to={`/product/${product.id}`}>
                <ProductImage src={product.imageUrl} alt={product.name} />
              </Link>
              <WishlistButton
                onClick={() => removeFromWishlist(product.id)}
                whileHover={fadeIn}
                whileTap={buttonClick}
                // Pass true if the item is in the wishlist, which it always will be on this page
                $active={true}
              >
                {/* Always show FaHeart since it's in the wishlist */}
                <FaHeart />
              </WishlistButton>
              <ProductInfo>
                <Link to={`/product/${product.id}`}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <span>₹{product.price}</span>
                </Link>
                <ActionButton
                  onClick={() => handleBuyNow(product)}
                  whileTap={buttonClick}
                >
                  <FaShoppingCart /> Buy Now
                </ActionButton>
                <ActionButton
                  onClick={() => handleAddToCart(product)}
                  whileTap={buttonClick}
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--primary-color)',
                    border: '1px solid var(--primary-color)',
                    marginTop: '10px'
                  }}
                >
                  Add to Cart
                </ActionButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      )}
    </WishlistContainer>
  );
}

export default Wishlist;
