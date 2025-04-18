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
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB connected");

        app.use('/', (req, res) => {
            res.send("Hello Sahil");
        });

        app.listen(3000, () => {
            console.log("Server is running beautifully");
        });

    } catch (err) {
        console.error("Connection error:", err);
    }
}

main();
