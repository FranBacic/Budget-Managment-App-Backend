const express = require("express");
const mongoose = require('mongoose');
const app = express();
app.use(express.json())

const dbConfig = require('./db')
const userRoute = require('./routes/userRoute')
const transactionRoute = require('./routes/transactionRoute')

app.use('/api/user', userRoute)
app.use('/api/transaction', transactionRoute)




const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
