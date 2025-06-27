const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Example of a protected route
router.get('/me', authController.protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;