const express = require("express");
const router = express.Router();

const Transaction = require('../models/transaction')

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
        res.send("Transaction added successfully")
        
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


module.exports = router;