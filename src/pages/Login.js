// src/pages/Login.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { pageTransition, fadeIn, buttonClick } from '../utils/animations';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 40px 20px;
`;

const LoginFormWrapper = styled(motion.div)`
  background-color: var(--dark-card-bg);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 450px;
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

const ToggleOption = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;

  button {
    background-color: ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
    color: ${props => props.$active ? 'white' : 'var(--text-light)'};
    border: 1px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--border-color)'};
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    transition: all var(--transition-speed);

    &:hover {
      background-color: ${props => props.$active ? 'var(--hover-effect)' : 'var(--input-bg)'};
      color: var(--primary-color);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      &:hover {
        background-color: transparent; /* Prevent hover effect on disabled button */
        color: var(--text-light);
      }
    }
  }
`;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  const [loginType, setLoginType] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please enter your credentials.');
      return;
    }

    // Only attempt login if the loginType is email
    if (loginType === 'email') {
      const result = login({
        email: identifier,
        password
      });

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } else {
      // For "coming soon" options, don't attempt login, just show a message
      setError('This feature is coming soon!');
    }
  };

  return (
    <LoginContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <LoginFormWrapper
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FormTitle>Welcome Back!</FormTitle>
        <ToggleOption>
          <button
            $active={loginType === 'email'}
            onClick={() => setLoginType('email')}
          >
            Login with Email
          </button>
          <button
            $active={loginType === 'phone'}
            onClick={() => {
              setLoginType('phone');
              setError('Login with Phone is coming soon!'); // Display message immediately
              setIdentifier(''); // Clear identifier and password for this option
              setPassword('');
            }}
            disabled // Disable the phone login button
          >
            Login with Phone (Coming Soon)
          </button>
        </ToggleOption>

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
            <Label htmlFor="identifier">
              {loginType === 'email' ? 'Email Address' : 'Phone Number'}
            </Label>
            <Input
              type={loginType === 'email' ? 'email' : 'tel'}
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={loginType === 'email' ? 'Enter your email' : 'Enter your phone number'}
              // Disable input fields if loginType is not 'email'
              disabled={loginType !== 'email'}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              // Disable input fields if loginType is not 'email'
              disabled={loginType !== 'email'}
            />
            <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </FormGroup>
          <SubmitButton
            type="submit"
            whileHover={fadeIn}
            whileTap={buttonClick}
            // Disable the submit button if loginType is not 'email'
            disabled={loginType !== 'email'}
          >
            Login
          </SubmitButton>
        </form>
        <AltOption>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </AltOption>
      </LoginFormWrapper>
    </LoginContainer>
  );
}

export default Login;
