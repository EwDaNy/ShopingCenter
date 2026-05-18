import express from "express";
import marketRoutes from "./routes/marketRoutes.js";
import connectDB from "./config/db.js";
import dns from "dns";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5001;


dns.setDefaultResultOrder("ipv4first");
const app = express();

app.use(cors());
connectDB();


app.use(express.json());
app.use("/api/market", marketRoutes);
app.use("/api/auth", authRoutes);



app.listen(PORT, ()=>{
    console.log("Server started on port", PORT);
});
