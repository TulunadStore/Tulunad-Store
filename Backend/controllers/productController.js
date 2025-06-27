// tulunad-backend/controllers/productController.js

const db = require('../db');
const { uploadFile, deleteFile } = require('../services/googleDriveService'); // Import upload and delete functions
const fs = require('fs'); // Node.js File System module for deleting temp files

// Helper to get Google Drive public URL
const getGoogleDrivePublicUrl = (fileId) => {
    if (!fileId) return null;
    // This is a common direct download link for Google Drive public files.
    // Make sure the file's permission is set to 'Anyone with the link' can view.
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

// --- Public Product Operations ---

exports.getAllProducts = (req, res) => {
    const sql = 'SELECT * FROM products ORDER BY id DESC'; // Order for consistent listing
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
        const productsWithUrls = results.map(product => ({
            ...product,
            // --- CHANGE START: Convert price and stock_quantity to numbers ---
            price: parseFloat(product.price),
            stock_quantity: parseInt(product.stock_quantity, 10), // Ensure integer
            // --- CHANGE END ---
            // Transforms the stored image_id into a public URL for display
            image_url: getGoogleDrivePublicUrl(product.image_id)
        }));
        res.json(productsWithUrls);
    });
};

exports.getProductById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const product = result[0];
        // --- CHANGE START: Convert price and stock_quantity to numbers ---
        product.price = parseFloat(product.price);
        product.stock_quantity = parseInt(product.stock_quantity, 10); // Ensure integer
        // --- CHANGE END ---
        // Transforms the stored image_id into a public URL for display
        product.image_url = getGoogleDrivePublicUrl(product.image_id);
        res.json(product);
    });
};

// --- Admin Product Management Operations ---

// Admin: Create Product
exports.createProduct = async (req, res) => {
    let { name, description, price, stock_quantity, category } = req.body; // Use let to reassign
    const imageFile = req.file; // This is populated by multer

    // --- CHANGE START: Explicitly convert price and stock_quantity to numbers ---
    // Make sure price is a float and stock_quantity is an integer before validation/DB insertion
    price = parseFloat(price);
    stock_quantity = parseInt(stock_quantity, 10); // Base 10 for safety
    // --- CHANGE END ---

    // Basic validation: name, price, and stock_quantity are essential
    // Now you can validate if they are valid numbers
    if (!name || isNaN(price) || price == null || isNaN(stock_quantity) || stock_quantity == null) {
        // If there was a file, delete the temporary file if validation fails
        if (imageFile && fs.existsSync(imageFile.path)) {
            fs.unlinkSync(imageFile.path);
        }
        return res.status(400).json({ message: 'Missing required fields or invalid data: name, price, stock_quantity must be valid numbers.' });
    }

    let googleDriveFileId = null;
    try {
        if (imageFile) {
            // Upload image to Google Drive
            const uploadedImage = await uploadFile(imageFile.path, imageFile.originalname, imageFile.mimetype);
            googleDriveFileId = uploadedImage.id;
        }

        const sql = 'INSERT INTO products (name, description, price, stock_quantity, image_id, category) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [name, description, price, stock_quantity, googleDriveFileId, category || null], (err, result) => {
            if (err) {
                console.error('Error creating product in DB:', err);
                // If DB insertion fails but image was uploaded, consider deleting the image from Drive
                if (googleDriveFileId) {
                    deleteFile(googleDriveFileId);
                }
                return res.status(500).json({ error: 'Failed to create product' });
            }
            res.status(201).json({ message: 'Product created successfully', productId: result.insertId, image_id: googleDriveFileId });
        });
    } catch (error) {
        console.error('Error during product creation process:', error);
        res.status(500).json({ error: error.message || 'Failed to create product' });
    }
};

// Admin: Update Product (includes manual stock update)
exports.updateProduct = async (req, res) => {
    const { id } = req.params; // Product ID from URL parameters
    let { name, description, price, stock_quantity, category } = req.body; // Updated product data // Use let
    const imageFile = req.file; // New image file, if uploaded

    // --- CHANGE START: Explicitly convert price and stock_quantity to numbers ---
    price = parseFloat(price);
    stock_quantity = parseInt(stock_quantity, 10);
    // --- CHANGE END ---

    // Basic validation: ensure essential fields are present for update
    if (!name || isNaN(price) || price == null || isNaN(stock_quantity) || stock_quantity == null) {
        if (imageFile && fs.existsSync(imageFile.path)) {
            fs.unlinkSync(imageFile.path); // Clean up temporary file
        }
        return res.status(400).json({ message: 'Missing required fields for update or invalid data: name, price, stock_quantity must be valid numbers.' });
    }

    let googleDriveFileId = null;
    let oldImageId = null; // To store the existing image_id from the DB

    try {
        // First, fetch the current product to get the old image_id
        const fetchSql = 'SELECT image_id FROM products WHERE id = ?';
        const [existingProduct] = await new Promise((resolve, reject) => {
            db.query(fetchSql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (existingProduct) {
            oldImageId = existingProduct.image_id;
        }

        if (imageFile) {
            // Upload the new image to Google Drive
            const uploadedImage = await uploadFile(imageFile.path, imageFile.originalname, imageFile.mimetype);
            googleDriveFileId = uploadedImage.id;

            // If a new image was uploaded and there was an old one, delete the old one
            if (oldImageId) {
                await deleteFile(oldImageId);
            }
        } else {
            // If no new image is provided, keep the existing image_id
            googleDriveFileId = oldImageId;
        }

        const sql = 'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, image_id = ?, category = ? WHERE id = ?';
        db.query(sql, [name, description, price, stock_quantity, googleDriveFileId, category || null, id], (err, result) => {
            if (err) {
                console.error('Error updating product in DB:', err);
                // If DB update fails but new image was uploaded, consider deleting the new image
                if (imageFile && googleDriveFileId) {
                    deleteFile(googleDriveFileId);
                }
                return res.status(500).json({ error: 'Failed to update product' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found or no changes made' });
            }
            res.json({ message: 'Product updated successfully', image_id: googleDriveFileId });
        });
    } catch (error) {
        console.error('Error during product update process:', error);
        res.status(500).json({ error: error.message || 'Failed to update product' });
    }
};

// Admin: Delete Product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params; // Product ID from URL parameters

    try {
        // First, get the image_id associated with the product
        const fetchImageSql = 'SELECT image_id FROM products WHERE id = ?';
        const [productToDelete] = await new Promise((resolve, reject) => {
            db.query(fetchImageSql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        const sql = 'DELETE FROM products WHERE id = ?';
        db.query(sql, [id], async (err, result) => {
            if (err) {
                console.error('Error deleting product from DB:', err);
                return res.status(500).json({ error: 'Failed to delete product' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // If product deleted from DB, attempt to delete image from Google Drive
            if (productToDelete && productToDelete.image_id) {
                await deleteFile(productToDelete.image_id); // Asynchronous call, but we don't await to hold response
            }

            res.json({ message: 'Product deleted successfully' });
        });
    } catch (error) {
        console.error('Error fetching product image ID before deletion:', error);
        res.status(500).json({ error: error.message || 'Failed to delete product' });
    }
};

// --- Internal Stock Management Function ---
exports.deductProductStock = (productId, quantity, callback) => {
    // --- CHANGE START: Ensure quantity is an integer here too ---
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        return callback(new Error('Invalid quantity for stock deduction.'));
    }
    const sql = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?';
    db.query(sql, [parsedQuantity, productId, parsedQuantity], (err, result) => { // Use parsedQuantity
    // --- CHANGE END ---
        if (err) {
            console.error('Error deducting product stock:', err);
            return callback(err); // Pass the error back to the caller
        }
        if (result.affectedRows === 0) {
            // This indicates either the product was not found or there wasn't enough stock to deduct
            return callback(new Error(`Insufficient stock or product not found for product ID: ${productId}`));
        }
        callback(null, true); // Indicate success
    });
};