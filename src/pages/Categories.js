// src/pages/Categories.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { pageTransition, fadeIn, itemHover } from '../utils/animations';
import dummyProducts from '../data/products'; // Your product data
import { useCart } from '../contexts/CartContext';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { buttonClick } from '../utils/animations';
import toast from 'react-hot-toast';
import { useWishlist } from '../contexts/WishlistContext'; // Import useWishlist context

const CategoriesContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
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

const CategoryFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 40px;
`;

const FilterButton = styled(motion.button)`
  background-color: ${props => props.$active ? 'var(--primary-color)' : 'var(--input-bg)'};
  color: ${props => props.$active ? 'white' : 'var(--text-light)'};
  padding: 10px 20px;
  border: 1px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
  box-shadow: ${props => props.$active ? '0 4px 15px rgba(var(--primary-color-rgb), 0.4)' : 'none'};

  &:hover {
    background-color: ${props => props.$active ? 'var(--hover-effect)' : 'var(--dark-card-bg)'};
    border-color: var(--hover-effect);
    transform: translateY(-2px);
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled(motion.div)`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: all var(--transition-speed);
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color);
`;

const ProductInfo = styled.div`
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 0.95rem;
    color: var(--text-dark);
    margin-bottom: 15px;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  span {
    font-size: 1.4rem;
    color: var(--accent-color);
    font-weight: 700;
    margin-top: 10px;
    display: block;
  }
`;

const AddToCartButton = styled(motion.button)`
  background-color: var(--accent-color);
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  transition: all var(--transition-speed);

  &:hover {
    background-color: var(--primary-color);
    transform: translateY(-2px);
  }
`;

const BuyNowButton = styled(AddToCartButton)`
  background-color: var(--primary-color);
  margin-top: 10px;
  &:hover {
    background-color: var(--hover-effect);
  }
`;

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
    color: ${props => props.$active ? 'var(--primary-color)' : 'var(--primary-color)'}; /* Always primary-color outline/fill */
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

const NoProductsMessage = styled(motion.p)`
  text-align: center;
  font-size: 1.5rem;
  color: var(--text-dark);
  margin-top: 50px;
`;

function Categories() {
  const [searchParams] = useSearchParams(); // Removed setSearchParams as it's no longer used in this component
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Get searchTerm directly from searchParams
  const currentSearchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const filterProducts = () => {
      let tempProducts = dummyProducts;

      if (categoryFilter !== 'all') {
        tempProducts = tempProducts.filter(product => product.category === categoryFilter);
      }

      // Use currentSearchTerm for filtering
      if (currentSearchTerm) {
        tempProducts = tempProducts.filter(product =>
          product.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
      }
      setFilteredProducts(tempProducts);
    };

    filterProducts();
  }, [categoryFilter, currentSearchTerm, searchParams]); // Added searchParams to dependencies to re-run on URL changes

  // Removed useEffect that called setSearchParams as it's not needed here.
  // The Header component is responsible for setting the search parameter in the URL.

  const handleCategoryClick = (category) => {
    setCategoryFilter(category);
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate('/checkout');
    toast.success(`${product.name} added to cart! Redirecting to checkout.`);
  };

  const categories = ['all', ...new Set(dummyProducts.map(p => p.category))];

  return (
    <CategoriesContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <PageTitle>Our Products</PageTitle>

      <CategoryFilterContainer>
        {categories.map(category => (
          <FilterButton
            key={category}
            onClick={() => handleCategoryClick(category)}
            $active={categoryFilter === category}
            variants={buttonClick}
            whileTap="tap"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </FilterButton>
        ))}
      </CategoryFilterContainer>

      {filteredProducts.length > 0 ? (
        <ProductGrid
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } }
          }}
        >
          {filteredProducts.map(product => (
            <ProductCard key={product.id} variants={fadeIn} whileHover={itemHover}>
              <Link to={`/product/${product.id}`}>
                <ProductImage src={product.image} alt={product.name} />
              </Link>
              <WishlistButton
                onClick={() => toggleWishlist(product)}
                initial="initial"
                animate="animate"
                variants={fadeIn}
                whileTap={buttonClick}
                $active={wishlistItems.some(item => item.id === product.id)}
              >
                {wishlistItems.some(item => item.id === product.id) ? <FaHeart /> : <FaRegHeart />}
              </WishlistButton>
              <ProductInfo>
                <Link to={`/product/${product.id}`}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
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
      ) : (
        <NoProductsMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {currentSearchTerm ? `No products found matching "${currentSearchTerm}".` : 'No products found in this category.'}
        </NoProductsMessage>
      )}
    </CategoriesContainer>
  );
}

export default Categories;
