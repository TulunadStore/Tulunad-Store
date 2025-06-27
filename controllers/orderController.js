// tulunad-backend/controllers/orderController.js

const db = require('../db');
const productController = require('./productController'); // Import product controller for stock deduction

exports.createOrder = (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;
  const user_id = req.user.id; // User ID from JWT token (assuming authController.protect ran)

  if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
    return res.status(400).json({ message: 'Missing required order details: items, totalAmount, shippingAddress' });
  }

  // Start a database transaction for atomicity
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Failed to process order.' });
    }

    const orderSql = 'INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, ?)';
    db.query(orderSql, [user_id, totalAmount, JSON.stringify(shippingAddress), 'pending'], async (err, orderResult) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error creating order:', err);
          res.status(500).json({ error: 'Failed to create order.' });
        });
      }

      const orderId = orderResult.insertId;
      const orderItemsPromises = items.map(item => {
        return new Promise((resolve, reject) => {
          // 1. Deduct stock first (important for concurrency)
          productController.deductProductStock(item.id, item.quantity, (stockErr) => {
            if (stockErr) {
              return reject(stockErr); // Propagate error for rollback
            }

            // 2. If stock deduction is successful, insert into order_items
            const orderItemSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
            db.query(orderItemSql, [orderId, item.id, item.quantity, item.price], (itemErr) => {
              if (itemErr) {
                return reject(itemErr);
              }
              resolve();
            });
          });
        });
      });

      try {
        await Promise.all(orderItemsPromises);
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              console.error('Error committing transaction:', err);
              res.status(500).json({ error: 'Failed to commit order.' });
            });
          }
          res.status(201).json({ message: 'Order placed successfully!', orderId: orderId });
        });
      } catch (error) {
        db.rollback(() => {
          console.error('Error processing order items or stock deduction, rolling back:', error);
          res.status(400).json({ error: error.message || 'Failed to place order due to stock or item error.' });
        });
      }
    });
  });
};

// You can add other order-related functions here, e.g., to view orders (for users or admin)
exports.getUserOrders = (req, res) => {
    const user_id = req.user.id;
    const sql = `
        SELECT o.id AS order_id, o.order_date, o.total_amount, o.status,
               oi.quantity, oi.price AS item_price, p.name AS product_name, p.image_id
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.order_date DESC, o.id DESC;
    `;
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching user orders:', err);
            return res.status(500).json({ error: 'Failed to fetch orders.' });
        }

        // Group items by order
        const ordersMap = new Map();
        results.forEach(row => {
            if (!ordersMap.has(row.order_id)) {
                ordersMap.set(row.order_id, {
                    order_id: row.order_id,
                    order_date: row.order_date,
                    total_amount: row.total_amount,
                    status: row.status,
                    items: []
                });
            }
            ordersMap.get(row.order_id).items.push({
                product_name: row.product_name,
                quantity: row.quantity,
                item_price: row.item_price,
                image_url: productController.getGoogleDrivePublicUrl(row.image_id)
            });
        });
        res.json(Array.from(ordersMap.values()));
    });
};

// Admin: Get all orders (you might want pagination/filters here)
exports.getAllOrders = (req, res) => {
    const sql = `
        SELECT o.id AS order_id, o.order_date, o.total_amount, o.status, o.shipping_address,
               u.username AS customer_username, u.email AS customer_email,
               oi.quantity, oi.price AS item_price, p.name AS product_name, p.image_id
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        ORDER BY o.order_date DESC, o.id DESC;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching all orders:', err);
            return res.status(500).json({ error: 'Failed to fetch all orders.' });
        }

        const ordersMap = new Map();
        results.forEach(row => {
            if (!ordersMap.has(row.order_id)) {
                ordersMap.set(row.order_id, {
                    order_id: row.order_id,
                    order_date: row.order_date,
                    total_amount: row.total_amount,
                    status: row.status,
                    shipping_address: row.shipping_address ? JSON.parse(row.shipping_address) : null,
                    customer: { username: row.customer_username, email: row.customer_email },
                    items: []
                });
            }
            ordersMap.get(row.order_id).items.push({
                product_name: row.product_name,
                quantity: row.quantity,
                item_price: row.item_price,
                image_url: productController.getGoogleDrivePublicUrl(row.image_id)
            });
        });
        res.json(Array.from(ordersMap.values()));
    });
};