const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt'); 

const User = require('../models/user')

router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/register", async (req, res) => {
    const { name, email, currency, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, currency, password: hashedPassword });
        const user = await newUser.save();
        res.send('User registered successfully');
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const temp = {
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    currency: user.currency,
                    _id: user._id,
                };
                res.send(temp);
            } else {
                return res.status(400).json({ message: 'Login failed' });
            }
        } else {
            return res.status(400).json({ message: 'Login failed' });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router;