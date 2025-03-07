import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import router from "./routers/router.js";

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// ==========
// App routers
// ==========

app.use("/api", router);
app.use("/", (req, res) => {
  res.send("Hello World!");
});

// ==========
// Error 404
// ==========

app.use((req, res) => {
  res.status(404).json({ message: "You are lost :(" });
});

// ==========
// App start
// ==========

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
