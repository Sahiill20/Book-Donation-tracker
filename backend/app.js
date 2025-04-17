const express = require('express')
const mongoose = require('mongoose')


require('dotenv').config()
const app = express();


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

