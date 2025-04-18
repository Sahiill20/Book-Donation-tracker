const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors'); 
const donateRoutes = require('./src/donate/donateRoutes');


const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Only allow frontend origin
    credentials: true
  }));
require('dotenv').config()

app.use('/api/donate', donateRoutes);

async function main() {
    await mongoose.connect(process.env.DB_URL);
    app.use('/',(req,res) =>{
        res.send("Hello Sahil");
    })
  }
  main().then(() => console.log("MongoDB connected")).catch(err => console.log(err));

app.listen(3000, () => {
    console.log("server is  running beautifully");
})

