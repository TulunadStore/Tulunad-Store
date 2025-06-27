// src/pages/Signup.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { pageTransition, fadeIn, buttonClick } from '../utils/animations';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 40px 20px;
`;

const SignupFormWrapper = styled(motion.div)`
  background-color: var(--dark-card-bg);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 500px;
  border: 1px solid var(--border-color);
  text-align: center;
`;

const FormTitle = styled.h2`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  text-align: left;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: var(--text-light);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
  color: var(--text-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color var(--transition-speed);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  }
`;

const PasswordToggle = styled.div`
  position: absolute;
  right: 10px;
  top: 38px;
  cursor: pointer;
  color: var(--text-dark);
  &:hover {
    color: var(--primary-color);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.95rem;

  input[type="checkbox"] {
    width: auto;
    margin-right: 10px;
    accent-color: var(--primary-color);
  }

  /* Styled span for the terms link */
  span {
    color: var(--primary-color);
    text-decoration: underline;
    cursor: pointer; /* Indicate it's clickable */
    &:hover {
      color: var(--hover-effect);
    }
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed);

  &:hover {
    background-color: var(--hover-effect);
    transform: translateY(-2px);
  }
`;

const AltOption = styled.p`
  margin-top: 25px;
  color: var(--text-dark);
  a {
    font-weight: 600;
  }
`;

const ErrorMessage = styled(motion.p)`
  color: #ff6b6b;
  margin-bottom: 15px;
  font-size: 0.9rem;
  text-align: left;
`;

const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  select {
    flex: 0 0 80px;
    padding: 12px;
    border: 1px solid var(--border-color);
    background-color: var(--input-bg);
    color: var(--text-light);
    border-radius: 8px;
  }
`;

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phoneCode: '+91',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handler for opening the Terms & Conditions modal via Footer
  const handleOpenTermsModal = (e) => {
    e.preventDefault(); // Prevent default link behavior
    // Navigate to the home page and pass state to open the terms modal in the Footer
    navigate('/', { state: { openModal: true, modalContent: 'terms' } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }

    const result = signup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phoneCode + formData.phone,
      password: formData.password,
    });

    if (result.success) {
      navigate('/account');
    } else {
      setError(result.message);
    }
  };

  return (
    <SignupContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <SignupFormWrapper
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FormTitle>Create Your Account</FormTitle>
        <form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </ErrorMessage>
          )}
          <FormGroup>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInputContainer>
              <select
                name="phoneCode"
                value={formData.phoneCode}
                onChange={handleChange}
              >
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
              </select>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </PhoneInputContainer>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
            <PasswordToggle onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </FormGroup>
          <CheckboxGroup>
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <label htmlFor="termsAccepted">
              I agree to the <span onClick={handleOpenTermsModal}>Terms & Conditions</span>
            </label>
          </CheckboxGroup>
          <SubmitButton
            type="submit"
            whileHover={fadeIn}
            whileTap={buttonClick}
          >
            Sign Up
          </SubmitButton>
        </form>
        <AltOption>
          Already have an account? <Link to="/login">Login here</Link>
        </AltOption>
      </SignupFormWrapper>
    </SignupContainer>
  );
}

export default Signup;
