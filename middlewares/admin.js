const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

function isAdmin(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        if (decoded.role !== 'admin') {
            console.log(`Access denied for user: ${decoded.username}, role: ${decoded.role}`);
            return res.status(403).json({ message: 'Access denied. Not an admin.' });
        }

        req.user = decoded; 
        next(); 
    });
}

module.exports = { isAdmin };
