const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/AuthRouter');
const ProductRouter = require('./routes/ProductRouter');
const mcqRouter = require("./routes/mcqRouter");
const quantmcqRouter = require("./routes/quantmcqRouter");
const behaviourRouter = require('./routes/behaviourRouter');
const technicalRouter = require('./routes/technicalRouter');
const sessionRoutes = require('./routes/sessionRoutes');
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
app.use("/api/beh-mcqs",behaviourRouter);
app.use("/api/beh-mcqs",technicalRouter);
app.use('/sessions', sessionRoutes);

/* app.get('/db-check', async (req, res) => {
    try {
      const count = await mongoose.connection.db.collection('session-output').countDocuments();
      res.json({
        connected: mongoose.connection.readyState === 1,
        collectionExists: count >= 0
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }); */


app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`);
});