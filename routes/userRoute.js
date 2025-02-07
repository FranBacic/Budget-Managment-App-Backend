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

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


router.post("/addgoal", async (req, res) => {
    const { userid, name, goalAmount, moneySaved } = req.body;

    try {
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        user.goals.push({ name, goalAmount, moneySaved });
        await user.save();

        res.status(200).json({ message: "Goal added successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/addgoalmoney", async (req, res) => {
    const { userid, goalid, moneySaved } = req.body;

    try {
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const goal = user.goals.id(goalid)
        if (!goal) {
            return res.status(404).json({ message: "Goal not found" })
        }


        const amount = parseFloat(moneySaved);
        if (user.moneyLeft < amount) {
            return res.status(400).json({ message: "Not enough money left!" });
        }


        goal.moneySaved += amount;
        user.moneyLeft -= amount;


        await user.save();

        res.status(200).json({ message: "money added successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/updategoal", async (req, res) => {
    const { userid, goalid, updatedName, updatedGoalAmount, updatedMoneySaved } = req.body;
    try {
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const goal = user.goals.id(goalid)
        if (!goal) {
            return res.status(404).json({ message: "Goal not found" })
        }
        if (goal) {
            goal.name = updatedName;
            goal.goalAmount = updatedGoalAmount;
            goal.moneySaved = updatedMoneySaved;

            await user.save();
            res.send('Goal Updated Successfully');
        } else {
            res.status(404).send('Goal Not Found');
        }
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});


module.exports = router;