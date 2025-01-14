const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        default: false
    },

    date: {
        type: Date,
        required: true
    },
    
    userid: {
        type: String,
        required: true
    },
       
    

}, {
    timestamps: true,
})

const transactionModel = mongoose.model('transaction', transactionSchema, 'transaction')

module.exports = transactionModel