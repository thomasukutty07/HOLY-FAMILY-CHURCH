import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './Database/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import memberRouter from '../server/Routes/memberRoute.js';
import authRouter from '../server/Routes/authRoutes.js';
import familyRouter from '../server/Routes/familyRoute.js';
import groupRouter from '../server/Routes/groupRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// CORS Configuration
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Cache-Control"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use("/church/admin", memberRouter);
app.use("/church/auth", authRouter);
app.use("/church/family", familyRouter);
app.use("/church/groups", groupRouter);

// Start server
function startServer() {
    connectDb();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
startServer();
