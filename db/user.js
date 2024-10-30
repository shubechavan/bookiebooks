const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user',
    },
    purchasedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
    }]
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); 
        this.password = await bcrypt.hash(this.password, salt); 
        next(); 
    } catch (error) {
        next(error); 
    }
});

UserSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password); 
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
