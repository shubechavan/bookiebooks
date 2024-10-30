const User = require('../db/user'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail=require('../services/mailer');
const secretKey = process.env.JWT_SECRET || 'your_secret_key';
const getSignupMessage = (username) => {
    return `Dear ${username},

Thank you for registering with us! We're excited to have you on board.

If you did not create an account, please ignore this email.

Best regards,
The bookiebooks Team`;
};
async function registerUser(req, res) {
    const { username, password, email } = req.body;

    console.log('Incoming registration data:', req.body); 

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save(); 

        const subject = "Welcome to bookiebooks!";
        const message = getSignupMessage(username);
        await sendEmail(email, subject, message);  

        res.status(201).json({ message: 'User registered successfully. Welcome email sent!' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: "Error during signup", error: error.message });
    }
}


    async function loginUser(req, res) {
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
    
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }
    
            // Generate token
            const token = jwt.sign(
                { id: user._id, username: user.username, role: user.role },
                secretKey,
                { expiresIn: '1h' }
            );
    
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    

    module.exports = { registerUser, loginUser };
