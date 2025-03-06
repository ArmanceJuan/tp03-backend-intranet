import fs from "fs";
import User from "./Models/userModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Error connecting to database", err));

const importUsers = async () => {
  try {
    const usersFilePath = path.join(__dirname, "./config/users.json");

    if (!fs.existsSync(usersFilePath)) {
      console.error(`${usersFilePath} does not exist`);
      process.exit(1);
    }

    const userData = fs.readFileSync(usersFilePath, "utf-8");
    const users = JSON.parse(userData);

    await User.deleteMany({});
    console.log("Users collection cleared");

    for (const user of users) {
      const newUser = new User({
        gender: user.gender,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
        phone: user.phone,
        birthdate: new Date(user.birthdate),
        city: user.city,
        country: user.country,
        photo:
          user.photo ||
          "https://i.pinimg.com/736x/67/b2/cc/67b2cc4e28fcf735c303f1d43c1bd698.jpg",
        category: user.category,
        isAdmin: user.isAdmin || false,
      });

      await newUser.save();
      console.log(`User ${user.firstname} ${user.lastname} imported`);
    }

    console.log("Data imported successfully");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importUsers();
