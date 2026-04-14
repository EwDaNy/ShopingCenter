import express from "express";
import marketRoutes from "./routes/marketRoutes.js";
import connectDB from "./config/db.js";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5001;


dns.setDefaultResultOrder("ipv4first");
const app = express();


connectDB();


app.use("/api/market", marketRoutes);

app.listen(PORT, ()=>{
    console.log("Server started on port", PORT);
});
