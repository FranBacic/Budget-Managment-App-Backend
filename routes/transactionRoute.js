const express = require("express");
const router = express.Router();

const Transaction = require('../models/transaction')
const User = require('../models/user');

router.get("/getalltransactions", async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.send(transactions);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

// router.get("/getincome", async (req, res) => {
//     try {
//         const transactions = await Transaction.find();
//         res.send(transactions);
//     } catch (error) {
//         return res.status(400).json({ error });
//     }
// });

router.post("/addtransaction", async (req, res) => {
    const { type, amount, description, category, date, userid } = req.body;

    try {
        const newTransaction = new Transaction({
            type,
            amount,
            description,
            category,
            date,
            userid,
        });

        await newTransaction.save();

        // Pronađi korisnika i ažuriraj njegov moneyLeft
        const user = await User.findById(userid);
        if (user) {
            if (type === "income") {
                user.moneyLeft += amount;
            } else if (type === "expense") {
                user.moneyLeft -= amount;
            }
            await user.save();
        }

        res.send("Transaction added successfully");
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.get("/getusertransactions", async (req, res) => {

    const { userid } = req.query;

    try {
        const userTransactions = await Transaction.find({ userid: userid })
        res.send(userTransactions)
    } catch (error) {
        return res.status(400).json({ error });
    }
});


router.put("/updatetransaction", async (req, res) => {
    const { type, amount, description, category, date, userid, transactionid } = req.body;

    try {
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const transaction = await Transaction.findById(transactionid);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        const oldAmount = transaction.amount;

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            transactionid,
            { type, amount, description, category, date },
            { new: true }
        );

        if (user) {
            if (type === "income") {
                if (amount > oldAmount) {
                    user.moneyLeft = user.moneyLeft + (amount - oldAmount);
                } else {
                    user.moneyLeft = user.moneyLeft - (oldAmount - amount);
                }
            } else if (type === "expense") {
                if (amount < oldAmount) {
                    user.moneyLeft = user.moneyLeft + (oldAmount - amount);
                } else {
                    user.moneyLeft = user.moneyLeft - (amount - oldAmount);
                }
            }
            await user.save();
        }

        res.json({ message: "Transaction updated successfully", updatedTransaction });
    } catch (error) {
        console.error("Error updating transaction:", error);
        return res.status(400).json({ message: error.message });
    }
});



module.exports = router;