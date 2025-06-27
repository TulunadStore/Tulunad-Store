// tulunad-backend/routes/products.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const multer = require('multer'); // Import multer

// Configure multer for temporary file storage
// It will save files to the 'uploads/' directory in your backend root
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Use a unique name for the file to prevent conflicts
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Public routes (anyone can view products)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-only routes (protected by authentication and role check)
// 'upload.single('image')' middleware will handle the file upload.
// The file will be available in req.file in the productController.
router.post(
    '/',
    authController.protect,
    authController.authorizeRoles('admin'),
    upload.single('image'), // Expects a single file input with name="image"
    productController.createProduct
);

router.put(
    '/:id',
    authController.protect,
    authController.authorizeRoles('admin'),
    upload.single('image'), // Expects a single file input with name="image" (optional for update)
    productController.updateProduct
);

router.delete(
    '/:id',
    authController.protect,
    authController.authorizeRoles('admin'),
    productController.deleteProduct
);

module.exports = router;