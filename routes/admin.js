const express = require('express');
const { isAdmin } = require('../middlewares/admin');
const User = require('../db/user');
const Books = require('../db/books');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET || 'yourSecretKey';

const jwtAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

router.post(
    '/register',
    [
        body('username').isString().notEmpty().withMessage('Username is required'),
        body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('email').isEmail().withMessage('Valid email is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashedPassword, role: 'user' }); // Set default role
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully', user: { username, email } });
        } catch (error) {
            res.status(500).json({ message: 'Registration failed', error: error.message });
        }
    }
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isString().notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }

            console.log('User found:', user);
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match result:', isMatch);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: user._id, username: user.username, role: user.role },
                secretKey,
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({ message: 'Login failed', error: error.message });
        }
    }
);

router.get('/users', jwtAuth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/users/:id', jwtAuth, isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/books', jwtAuth, isAdmin, async (req, res) => {
    try {
        const { title, description, dueDate, status } = req.body;

        const newBook = new Books({
            title,
            description,
            dueDate,
            status: status || 'incomplete'
        });

        await newBook.save();
        res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/books/:id', jwtAuth, isAdmin, async (req, res) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await Books.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
