const mongoose = require('mongoose');

const BooksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    dueDate: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ['incomplete', 'complete'],
        default: 'incomplete'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });  

const Books = mongoose.model('Books', BooksSchema);
module.exports = Books;
