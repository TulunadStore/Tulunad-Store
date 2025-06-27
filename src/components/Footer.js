// src/components/Footer.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaChevronLeft } from 'react-icons/fa';

const StyledFooter = styled(motion.footer)`
  background-color: var(--dark-card-bg);
  color: var(--text-light);
  padding: 40px 20px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  font-size: 0.9rem;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.4);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
    width: 100%;
  }

  h3 {
    color: var(--primary-color);
    margin-bottom: 15px;
    font-size: 1.2rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 8px;
  }

  a, button {
    color: var(--text-dark);
    text-decoration: none;
    transition: color var(--transition-speed);
    background: none;
    border: none;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    padding: 0;

    &:hover {
      color: var(--primary-color);
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;

  a {
    color: var(--text-dark);
    font-size: 1.5rem;
    transition: color var(--transition-speed), transform var(--transition-speed);

    &:hover {
      color: var(--primary-color);
      transform: translateY(-3px);
    }
  }
`;

const Copyright = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  color: var(--text-dark);
  width: 100%;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: var(--dark-card-bg);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  position: relative;
  width: 90%;
  max-width: 600px;
  border: 1px solid var(--primary-color);
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);

  button {
    margin-right: 15px;
    font-size: 1.2rem;
    color: var(--primary-color);
    background: none;
    border: none;
    cursor: pointer;
  }

  h3 {
    margin: 0;
    color: var(--primary-color);
  }
`;

const ModalBody = styled.div`
  color: var(--text-light);
  line-height: 1.6;

  p {
    margin-bottom: 15px;
  }

  h4 {
    color: var(--primary-color);
    margin: 20px 0 10px;
  }
`;

function Footer() {
  const currentYear = new Date().getFullYear();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const location = useLocation(); // Hook to get the current location object
  const navigate = useNavigate(); // Hook to programmatically navigate

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    // Clear the state from the URL to prevent the modal from reopening on subsequent renders
    navigate(location.pathname, { replace: true, state: {} });
  };

  // Effect to check for state passed from other components (like Signup)
  useEffect(() => {
    if (location.state && location.state.openModal && location.state.modalContent) {
      openModal(location.state.modalContent);
    }
  }, [location.state]); // Depend on location.state to trigger when state changes

  const renderModalContent = () => {
    switch (modalContent) {
      case 'about':
        return (
          <>
            <ModalHeader>
              <button onClick={closeModal}><FaChevronLeft /></button>
              <h3>About Us</h3>
            </ModalHeader>
            <ModalBody>
              <p>Welcome to Tulunad Store, your premier destination for authentic merchandise inspired by the vibrant culture of Tulunad, Karnataka.</p>
              <p>Founded in 2025, we are dedicated to preserving and promoting the rich heritage of Tulunad through our carefully curated collection of products.</p>
              <h4>Our Mission</h4>
              <p>To bring the essence of Tulunad culture to people around the world through high-quality, culturally significant products.</p>
            </ModalBody>
          </>
        );
      case 'terms':
        return (
          <>
            <ModalHeader>
              <button onClick={closeModal}><FaChevronLeft /></button>
              <h3>Terms & Conditions</h3>
            </ModalHeader>
            <ModalBody>
              <h4>1. General Terms</h4>
              <p>By accessing and placing an order with Tulunad Store, you confirm that you are in agreement with and bound by the terms of service contained in these Terms & Conditions.</p>

              <h4>2. Products</h4>
              <p>We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Store.</p>

              <h4>3. Pricing</h4>
              <p>All prices are in Indian Rupees (₹) and are subject to change without notice. We reserve the right to modify or discontinue products without notice at any time.</p>

              <h4>4. Shipping & Delivery</h4>
              <p>We ship all over India. Delivery times may vary depending on the location and shipping method selected.</p>
            </ModalBody>
          </>
        );
      case 'faq':
        return (
          <>
            <ModalHeader>
              <button onClick={closeModal}><FaChevronLeft /></button>
              <h3>Frequently Asked Questions</h3>
            </ModalHeader>
            <ModalBody>
              <h4>How long does delivery take?</h4>
              <p>Standard delivery typically takes 3-5 business days within India. Express delivery options are available at checkout.</p>

              <h4>What payment methods do you accept?</h4>
              <p>We accept UPI, credit/debit cards, net banking, and cash on delivery (COD).</p>

              <h4>Can I return or exchange a product?</h4>
              <p>Yes, we offer a 7-day return policy for most products. Please see our Returns & Exchanges page for details.</p>

              <h4>Do you ship internationally?</h4>
              <p>Currently, we only ship within India. International shipping options will be available soon.</p>
            </ModalBody>
          </>
        );
      case 'contact':
        return (
          <>
            <ModalHeader>
              <button onClick={closeModal}><FaChevronLeft /></button>
              <h3>Contact Us</h3>
            </ModalHeader>
            <ModalBody>
              <p>We'd love to hear from you! Here's how you can reach us:</p>

              <h4>Email</h4>
              <p>tulunadstore@gmail.com </p>

              <h4>Phone</h4>
              <p>+91 8722229750 (10AM - 7PM, Monday to Friday)</p>

              <h4>Address</h4>
              <p>Tulunad Store<br />
              Navyan Technologies LLP<br />
              4-43(1),<br />
              Gurukripa, Near Uppikala, Athikaribettu via Mulki Dakshina Kannada, Karnataka- 574154<br />
              India</p>
            </ModalBody>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <StyledFooter
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <FooterContent>
        <FooterSection>
          <h3>Tulunad Store</h3>
          <p style={{color: 'var(--text-dark)'}}>Discover authentic merchandise inspired by the vibrant culture of Tulunad, Karnataka.</p>
          <SocialIcons>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </SocialIcons>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/account">Account</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Customer Service</h3>
          <ul>
            <li><button onClick={() => openModal('about')}>About Us</button></li>
            <li><button onClick={() => openModal('terms')}>Terms & Conditions</button></li>
            <li><button onClick={() => openModal('contact')}>Contact Us</button></li>
            <li><button onClick={() => openModal('faq')}>FAQ</button></li>
          </ul>
        </FooterSection>
      </FooterContent>

      <Copyright>
        &copy; {currentYear} Tulunad Store. All rights reserved.
      </Copyright>

      <AnimatePresence>
        {modalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderModalContent()}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </StyledFooter>
  );
}

export default Footer;
