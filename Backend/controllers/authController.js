// tulunad-backend/controllers/authController.js

const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const signToken = (id, username, email, role) => {
    return jwt.sign({ id, username, email, role }, process.env.JWT_SECRET, {
        expiresIn: '7d', // <--- CHANGED: Token now expires in 7 days (was '1h')
    });
};

// --- User Authentication and Registration ---

exports.signup = (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    console.log('Signup: Received request body:', req.body);

    if (!firstName || !lastName || !email || !password) {
        console.log('Signup: Missing required fields');
        return res.status(400).json({ message: 'All fields are required' });
    }

    const username = `${firstName} ${lastName}`;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log('Signup: Original Password:', password);
    console.log('Signup: Hashed Password for Storage:', hashedPassword);

    const role = 'user'; // Assign default role

    const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    const values = [username, email, hashedPassword, role];

    console.log('Signup: SQL Query:', sql);
    console.log('Signup: SQL Values:', values);

    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.error('Signup Error: Duplicate entry for email:', err);
                return res.status(409).json({ message: 'Email already exists. Please use a different email or log in.' });
            }
            console.error('Signup Error: Database query failed:', err);
            return res.status(500).json({ error: 'Failed to register user due to database error.' });
        }
        console.log('Signup Success: User inserted with ID:', result.insertId);
        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Login error: Database query failed:', err);
            return res.status(500).json({ error: 'Internal server error during login query.' });
        }
        if (results.length === 0) {
            console.log('Login: User not found for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const storedHashedPassword = user.password;

        console.log('Login: Received Password:', password);
        console.log('Login: Stored Hashed Password (from DB):', storedHashedPassword);

        const isMatch = bcrypt.compareSync(password, storedHashedPassword);

        console.log('Login: Password Match Result (isMatch):', isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user.id, user.username, user.email, user.role);
        res.json({
            message: 'Logged in successfully',
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    });
};

exports.protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        // The specific error type is 'TokenExpiredError' if it's an expiration issue
        // We can differentiate or provide a generic "invalid/expired" message.
        return res.status(401).json({ message: 'Invalid token or token expired. Please log in again.' });
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' });
        }
        next();
    };
};