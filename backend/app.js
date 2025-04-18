import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import donateRoutes from './src/Donate/donateRoutes.js'; // adjust path if needed

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', donateRoutes);

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
