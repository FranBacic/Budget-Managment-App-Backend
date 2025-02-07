const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    currency: {
        type: String,
        required: true
    },

    moneyLeft: {

        type: Number,
        default: 0

    },

    goals: [
        {
            name: { type: String, required: true },
            goalAmount: { type: Number, required: true },
            moneySaved: { type: Number, required: true }
        }
    ]



}, {
    timestamps: true,
})

const userModel = mongoose.model('user', userSchema, 'user')

module.exports = userModel