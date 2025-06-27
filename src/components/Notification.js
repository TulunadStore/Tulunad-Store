// src/components/Notification.js (If you still want a custom one, otherwise use react-hot-toast)
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const StyledNotification = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${props => props.type === 'success' ? '#28a745' : '#dc3545'};
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  font-weight: 500;
`;

const Notification = ({ message, type, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <StyledNotification
          type={type}
          initial={{ opacity: 0, y: -50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -50, x: 50 }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </StyledNotification>
      )}
    </AnimatePresence>
  );
};

export default Notification;