import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
connectDB();

app.use(express.json());
app.use(cors());

// ==========
// App routers
// ==========

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ==========
// App start
// ==========

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
