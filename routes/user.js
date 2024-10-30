const express = require('express');
const { registerUser, loginUser } = require('../middlewares/user');
const authenticateJWT = require('../middlewares/auth'); 
const User = require('../db/user'); 
const Books = require("../db/books");
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/change-password', authenticateJWT, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/books', authenticateJWT, async (req, res) => {
    try {
        const books = await Books.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Books not found", error: error.message });
    }
});

router.post('/books/:bookId/purchase', authenticateJWT, async (req, res) => {
    const bookId = req.params.bookId;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        const book = await Books.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (user.purchasedBooks.includes(bookId)) {
            return res.status(400).json({ message: 'You already purchased this book.' });
        }

        user.purchasedBooks.push(bookId);
        await user.save();

        res.status(200).json({ message: 'Book purchased successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
