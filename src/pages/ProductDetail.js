// src/pages/ProductDetail.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaHeart, FaRegHeart, FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa';
import dummyProducts from '../data/products';
import { useCart } from '../contexts/CartContext';
import { pageTransition, fadeIn, buttonClick } from '../utils/animations';
import { toast } from 'react-hot-toast'; // Import toast for notifications
import { useWishlist } from '../contexts/WishlistContext'; // Import useWishlist context

const ProductDetailContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 160px);
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

const ProductWrapper = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const ProductGallery = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MainImage = styled(motion.div)`
  width: 100%;
  height: 500px;
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 350px;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Thumbnail = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  transition: all var(--transition-speed);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  padding: 20px 0;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 15px;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;

  .current-price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
  }

  .original-price {
    font-size: 1.5rem;
    text-decoration: line-through;
    color: var(--text-dark);
    opacity: 0.7;
  }

  .discount {
    background-color: var(--primary-color);
    color: white;
    padding: 3px 10px;
    border-radius: 5px;
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  .stars {
    display: flex;
    gap: 3px;
    color: #ffc107;
  }

  .reviews {
    color: var(--text-dark);
    font-size: 0.9rem;
  }
`;

const ProductDescription = styled.p`
  color: var(--text-light);
  margin-bottom: 30px;
  line-height: 1.6;
`;

const CustomizationForm = styled.form`
  margin-bottom: 30px;

  h3 {
    color: var(--primary-color);
    margin-bottom: 15px;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    background-color: var(--input-bg);
    color: var(--text-light);
    border-radius: 8px;
    font-size: 1rem;
    min-height: 100px;
    margin-bottom: 15px;
    resize: vertical;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 40px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(motion.button)`
  flex: 1;
  background-color: var(--primary-color);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all var(--transition-speed);

  &:hover {
    background-color: var(--hover-effect);
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(motion.button)`
  flex: 1;
  background-color: var(--input-bg);
  color: var(--text-light);
  padding: 15px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all var(--transition-speed);

  &:hover {
    background-color: var(--dark-card-bg);
    color: var(--primary-color);
    transform: translateY(-2px);
  }
`;

// Updated WishlistButton for a simple heart icon
const WishlistButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
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

// NEW STYLED COMPONENTS FOR REVIEWS
const ReviewsSection = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);

  h3 {
    color: var(--primary-color);
    margin-bottom: 20px;
  }
`;

const ReviewForm = styled.form`
  background-color: var(--input-bg);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;

  h4 {
    color: var(--text-light);
    margin-bottom: 15px;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    background-color: var(--dark-card-bg);
    color: var(--text-light);
    border-radius: 8px;
    font-size: 1rem;
    min-height: 100px;
    margin-bottom: 15px;
    resize: vertical;
  }
`;

const ReviewItem = styled.div`
  background-color: var(--input-bg);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid var(--border-color);

  .review-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .review-author {
    font-weight: 600;
    color: var(--text-light);
  }

  .review-date {
    color: var(--text-dark);
    font-size: 0.8rem;
  }

  .review-stars {
    color: #ffc107;
    margin-bottom: 5px;
  }

  .review-text {
    color: var(--text-light);
    line-height: 1.5;
  }
`;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist(); // Use wishlist context
  const [selectedImage, setSelectedImage] = useState(0);
  const [customText, setCustomText] = useState('');
  const [quantity, setQuantity] = useState(1);

  // NEW STATE DECLARATIONS FOR REVIEWS
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Ramesh',
      date: '2023-05-15',
      rating: 5,
      text: 'Excellent product quality and fast delivery!'
    },
    {
      id: 2,
      author: 'Suresh',
      date: '2023-04-22',
      rating: 4,
      text: 'Good material but the size was slightly smaller than expected'
    }
  ]);

  const product = dummyProducts.find(p => p.id === id);

  // Check if the current product is in the wishlist
  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  if (!product) {
    return (
      <ProductDetailContainer
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <div>Product not found</div>
      </ProductDetailContainer>
    );
  }

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist!');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, customText: product.isCustomizable ? customText : undefined });
    navigate('/cart');
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity, customText: product.isCustomizable ? customText : undefined });
    navigate('/checkout');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save the customization details
    toast.success(`Customization submitted: "${customText}"`);
  };

  // NEW FUNCTION FOR REVIEW SUBMISSION
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      const newReview = {
        id: Date.now(),
        author: 'You', // In a real app, this would be the logged-in user's name
        date: new Date().toISOString().split('T')[0],
        rating,
        text: reviewText
      };
      setReviews([newReview, ...reviews]); // Add new review to the top
      setReviewText(''); // Clear the review text field
      setRating(5); // Reset rating
      toast.success('Review submitted successfully!');
    } else {
      toast.error('Review text cannot be empty.');
    }
  };

  const images = [
    product.imageUrl,
    "https://images.unsplash.com/photo-1621217036224-f7b7f14b609c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzIyNzJ8MHwxfHNlYXJjaHw0fHlpbmRpYW4lMjB0cmFkaXRpb25hbCUyMGNsb3RoZXN8ZW58MHx8fHwxNzE3NzU3MzEzfDA&ixlib=rb-4.0.3&q=80&w=600",
    "https://images.unsplash.com/photo-1621217036224-f7b7f14b609c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzIyNzJ8MHwxfHNlYXJjaHw0fHltZWRpJTIwdHJhZGl0aW9uYWwlMjBzaGlydHxlbnwwfHx8fDE3MTc3NDYwNzJ8MA&ixlib=rb-4.0.3&q=80&w=600",
    "https://images.unsplash.com/photo-1621217036224-f7b7f14b609c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzIyNzJ8MHwxfHNlYXJjaHw0fHlpbmRpYW4lMjB0cmFkaXRpb25hbCUyMGNsb3RoZXN8ZW58MHx8fHwxNzE3NzU3MzEzfDA&ixlib=rb-4.0.3&q=80&w=600"
  ];

  // Calculate discount (dummy value for demo)
  const originalPrice = Math.round(product.price * 1.2);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <ProductDetailContainer
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
        <FaArrowLeft /> Back to Products
      </BackButton>

      <ProductWrapper>
        <ProductGallery>
          <MainImage>
            <img src={images[selectedImage]} alt={product.name} />
            <WishlistButton
              onClick={handleToggleWishlist} // Call the toggle function
              whileHover={fadeIn}
              whileTap={buttonClick}
              $active={isWishlisted} // Pass the active state to the button
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />} {/* Render filled or outline heart */}
            </WishlistButton>
          </MainImage>
          <ThumbnailContainer>
            {images.map((img, index) => (
              <Thumbnail
                key={index}
                $active={selectedImage === index}
                onClick={() => setSelectedImage(index)}
                whileHover={fadeIn}
                whileTap={buttonClick} // Added buttonClick animation for thumbnails
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </Thumbnail>
            ))}
          </ThumbnailContainer>
        </ProductGallery>

        <ProductInfo>
          <ProductTitle>{product.name}</ProductTitle>

          <ProductPrice>
            <span className="current-price">₹{product.price}</span>
            <span className="original-price">₹{originalPrice}</span>
            <span className="discount">{discountPercent}% OFF</span>
          </ProductPrice>

          <ProductRating>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                star <= 4 ? <FaStar key={star} /> : <FaRegStar key={star} /> // Hardcoded 4 stars for demo
              ))}
            </div>
            <span className="reviews">({reviews.length} reviews)</span> {/* Dynamically show review count */}
          </ProductRating>

          <ProductDescription>{product.description}</ProductDescription>

          {product.isCustomizable && (
            <CustomizationForm onSubmit={handleCustomSubmit}>
              <h3>Customization Options</h3>
              <p style={{ color: 'var(--text-dark)', marginBottom: '10px' }}>Tell us what you'd like to customize (e.g., names, colors, sizes):</p>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter your customization details..."
                required
              />
              <PrimaryButton
                type="submit"
                whileHover={fadeIn}
                whileTap={buttonClick}
              >
                Save Customization
              </PrimaryButton>
            </CustomizationForm>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <label htmlFor="quantity" style={{ color: 'var(--text-light)' }}>Quantity:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: '5px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-light)',
                border: '1px solid var(--border-color)'
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <ActionButtons>
            <PrimaryButton
              onClick={handleBuyNow}
              whileHover={fadeIn}
              whileTap={buttonClick}
            >
              <FaShoppingCart /> Buy Now
            </PrimaryButton>
            <SecondaryButton
              onClick={handleAddToCart}
              whileHover={fadeIn}
              whileTap={buttonClick}
            >
              <FaShoppingCart /> Add to Cart
            </SecondaryButton>
          </ActionButtons>
        </ProductInfo>
      </ProductWrapper>

      {/* NEW REVIEWS SECTION */}
      <ReviewsSection>
        <h3>Customer Reviews</h3>

        <ReviewForm onSubmit={handleReviewSubmit}>
          <h4>Write a Review</h4>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ marginRight: '10px', color: 'var(--text-light)' }}>Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                color={star <= rating ? '#ffc107' : 'var(--text-dark)'} // Use text-dark for unselected stars
                style={{ cursor: 'pointer' }}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this product..."
            required
          />
          <PrimaryButton
            type="submit"
            whileHover={fadeIn}
            whileTap={buttonClick}
          >
            Submit Review
          </PrimaryButton>
        </ReviewForm>

        {reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewItem key={review.id}>
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                <span className="review-date">{review.date}</span>
              </div>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  star <= review.rating ? <FaStar key={star} /> : <FaRegStar key={star} />
                ))}
              </div>
              <p className="review-text">{review.text}</p>
            </ReviewItem>
          ))
        ) : (
          <p style={{textAlign: 'center', color: 'var(--text-dark)'}}>No reviews yet. Be the first to review this product!</p>
        )}
      </ReviewsSection>
    </ProductDetailContainer>
  );
}

export default ProductDetail;
