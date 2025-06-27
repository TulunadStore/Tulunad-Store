// src/utils/animations.js
export const pageTransition = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
  transition: { type: 'spring', stiffness: 100, damping: 20, duration: 0.5 },
};

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export const slideInFromLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.2 },
};

export const slideInFromRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.2 },
};

export const itemHover = {
  scale: 1.05,
  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
  transition: { type: 'spring', stiffness: 300, damping: 10 },
};

export const buttonClick = {
  scale: 0.95,
  transition: { type: 'spring', stiffness: 500, damping: 10 },
};

export const scribbleAnimation = {
  draw: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } },
  initial: { pathLength: 0, opacity: 0 },
};