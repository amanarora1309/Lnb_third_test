import express from 'express';
import dotenv from 'dotenv'
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js'
import connectDB from './config/db.js';
import cors from 'cors'
import path from 'path';

// create __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//configure env
dotenv.config()

// database config
connectDB();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use("/api/v1/auth", authRoutes);



//PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server Running on ${PORT}`.bgCyan.white);
});

