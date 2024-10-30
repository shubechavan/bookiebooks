const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'your_default_mongo_uri_here';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

module.exports = {
    Admin,
    User,
    Books
};
