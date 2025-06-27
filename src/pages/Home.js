// src/pages/Home.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { pageTransition, fadeIn, itemHover, scribbleAnimation } from '../utils/animations';
import dummyProducts from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext'; // Ensure this import is correct
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'; // Ensure both heart icons are imported
import { buttonClick } from '../utils/animations';

const HomeContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeroSection = styled(motion.section)`
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--dark-card-bg) 100%);
  border-radius: 15px;
  padding: 60px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
  }
`;

const HeroText = styled(motion.div)`
  flex: 1;
  h1 {
    font-size: 3.5rem;
    color: var(--primary-color);
    line-height: 1.1;
    margin-bottom: 20px;
    span {
      font-family: 'Permanent Marker', cursive;
      color: var(--text-light);
      position: relative;
    }
  }
  p {
    font-size: 1.2rem;
    color: var(--text-dark);
    margin-bottom: 30px;
    max-width: 500px;
    @media (max-width: 992px) {
      margin-left: auto;
      margin-right: auto;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const CallToActionButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 15px rgba(var(--primary-color-rgb), 0.3);
  transition: all var(--transition-speed);

  &:hover {
    background-color: var(--hover-effect);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 20px rgba(var(--hover-effect-rgb), 0.4);
  }
`;

const HeroImage = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
    transition: transform 0.5s ease;
    perspective: 1000px;

    &:hover {
      transform: rotateY(5deg) scale(1.03);
    }
  }
  @media (max-width: 992px) {
    margin-top: 40px;
  }
`;

const ScribbleArt = styled(motion.svg)`
  position: absolute;
  top: ${props => props.$top || 'unset'};
  bottom: ${props => props.$bottom || 'unset'};
  left: ${props => props.$left || 'unset'};
  right: ${props => props.$right || 'unset'};
  width: ${props => props.$width || '100px'};
  height: ${props => props.$height || 'auto'};
  fill: none;
  stroke: var(--primary-color);
  stroke-width: 3px;
  filter: drop-shadow(0 0 5px var(--primary-color));
  z-index: 1;
  opacity: 0.6;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: var(--primary-color);
  text-shadow: 0 0 10px rgba(var(--primary-color-rgb), 0.3);

  span {
    font-family: 'Permanent Marker', cursive;
    color: var(--text-light);
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
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

const AddToCartButton = styled(motion.button)`
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

const BuyNowButton = styled(motion.button)`
  background-color: var(--input-bg);
  color: var(--primary-color);
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid var(--primary-color);
  cursor: pointer;
  transition: all var(--transition-speed);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background-color: var(--dark-card-bg);
    transform: translateY(-2px);
  }
`;

// Updated WishlistButton for a simple heart icon
const WishlistButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: transparent; /* Remove background */
  border: none; /* Remove border */
  cursor: pointer;
  z-index: 2;
  width: 48px; /* Set a clickable area for the icon */
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  transition: transform var(--transition-speed);

  /* Style the Font Awesome heart icon directly */
  svg {
    font-size: 2rem; /* Size of the heart icon */
    color: ${props => props.$active ? 'var(--primary-color)' : 'var(--primary-color)'}; /* Always pink outline/fill */
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

const CategorySection = styled(motion.section)`
  margin-bottom: 60px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
`;

const CategoryCard = styled(motion.div)`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: all var(--transition-speed);

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  }

  a {
    display: block;
    padding: 30px 20px;
    color: var(--text-light);
    font-size: 1.5rem;
    font-weight: 700;
    text-decoration: none;
    transition: color var(--transition-speed);

    &:hover {
      color: var(--primary-color);
    }
  }
`;

function Home() {
  const { addToCart } = useCart();
  // Destructure wishlistItems and toggleWishlist from the global WishlistContext
  const { wishlistItems, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  // Using dummyProducts for display. Make sure your actual product data is consistent.
  const featuredProducts = dummyProducts.slice(0, 4);

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <HomeContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <HeroSection
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <ScribbleArt
          $top="20px" $left="10px" $width="150px"
          viewBox="0 0 200 50"
          initial="initial"
          animate="draw"
          variants={scribbleAnimation}
        >
          <path d="M10 30 Q 50 10, 100 30 T 190 20" />
        </ScribbleArt>
        <ScribbleArt
          $bottom="20px" $right="10px" $width="150px"
          viewBox="0 0 200 50"
          initial="initial"
          animate="draw"
          variants={scribbleAnimation}
          transition={{ ...scribbleAnimation.transition, delay: 0.5 }}
        >
          <path d="M190 20 Q 150 40, 100 20 T 10 30" />
        </ScribbleArt>

        <HeroText
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1>Discover the <span>Essence</span> of Tulunad</h1>
          <p>Explore our exclusive collection of merchandise, shirts, and shawls for men, women, and kids, rooted in the vibrant Tulunad culture of Karnataka, India.</p>
          <Link to="/categories">
            <CallToActionButton
              whileHover={itemHover}
              whileTap={buttonClick}
            >
              Shop Now
            </CallToActionButton>
          </Link>
        </HeroText>
        <HeroImage
          initial={{ x: 100, opacity: 0, rotateY: 10 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <img src="https://images.unsplash.com/photo-1621217036224-f7b7f14b609c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzIyNzJ8MHwxfHNlYXJjaHw0fHlpbmRpYW4lMjB0cmFkaXRpb25hbCUyMGNsb3RoZXN8ZW58MHx8fHwxNzE3NzU3MzEzfDA&ixlib=rb-4.0.3&q=80&w=600" alt="Tulunad Culture Merchandise" />
        </HeroImage>
      </HeroSection>

      <SectionTitle
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeIn}
      >
        Featured <span>Products</span>
      </SectionTitle>
      <ProductGrid>
        {featuredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            initial="initial"
            whileInView="animate"
            whileHover={itemHover}
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              initial: { opacity: 0, y: 50 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } },
            }}
          >
            <Link to={`/product/${product.id}`}>
              <ProductImage src={product.imageUrl} alt={product.name} />
            </Link>
            {/* Conditional rendering of FaHeart or FaRegHeart based on wishlistItems */}
            <WishlistButton
              onClick={() => toggleWishlist(product)} // Pass the entire product object
              whileHover={fadeIn}
              whileTap={buttonClick}
              $active={wishlistItems.some(item => item.id === product.id)} // Pass active state to the button
            >
              {/* Check if the product's ID exists in the wishlistItems array */}
              {wishlistItems.some(item => item.id === product.id) ? <FaHeart /> : <FaRegHeart />}
            </WishlistButton>
            <ProductInfo>
              <Link to={`/product/${product.id}`}>
                <h3>{product.name}</h3>
                <p>{product.description.substring(0, 70)}...</p>
                <span>₹{product.price}</span>
              </Link>
              <AddToCartButton
                onClick={() => addToCart(product)}
                whileTap={buttonClick}
              >
                <FaShoppingCart /> Add to Cart
              </AddToCartButton>
              <BuyNowButton
                onClick={() => handleBuyNow(product)}
                whileTap={buttonClick}
              >
                Buy Now
              </BuyNowButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>

      <SectionTitle
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeIn}
      >
        Explore Our <span>Categories</span>
      </SectionTitle>
      <CategorySection>
        <CategoryGrid>
          {['Men', 'Women', 'Kids', 'Shawls', 'Customized'].map((category, index) => (
            <CategoryCard
              key={category}
              initial="initial"
              whileInView="animate"
              whileHover={itemHover}
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: index * 0.15 } },
              }}
            >
              {/* MODIFICATION HERE: Change 'filter' to 'category' in the query string */}
              <Link to={`/categories?category=${category.toLowerCase()}`}>
                {category}
              </Link>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </CategorySection>
    </HomeContainer>
  );
}

export default Home;