const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/AuthRouter');
const ProductRouter = require('./routes/ProductRouter');
const mcqRouter = require("./routes/mcqRouter");
const quantmcqRouter = require("./routes/quantmcqRouter");

require('dotenv').config();
require('./models/db');


const PORT = process.env.PORT || 8080;

app.get('/ping',(req,res)=>{
    res.send('PING');
});

app.use(bodyParser.json());
app.use(cors()); //we can add the object config also...
app.use('/auth', authRouter);
app.use('/products',ProductRouter);
app.use("/api/mcqs", mcqRouter);
app.use("/api/quant-mcqs", quantmcqRouter);


app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`);
});