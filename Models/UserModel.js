import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
      trim: true,
      minlength: [3, "Your first name must be at least 3 characters"],
      maxlength: [50, "Your first name must not exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
      trim: true,
      minlength: [3, "Your last name must be at least 3 characters"],
      maxlength: [50, "Your last name must not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return email.includes("@");
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      trim: true,
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [128, "Password must be less than 128 characters"],
      validate: {
        validator: function (password) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/.test(
            password
          );
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    category: {
      type: String,
      enum: ["marketing", "client", "technique", "other"],
      default: "other",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.hashPassword = function (password) {
  return crypto
    .createHmac("sha256", process.env.HASH_SECRET)
    .update(password)
    .digest("hex");
};

userSchema.methods.comparePassword = function (password) {
  return this.password === this.hashPassword(password);
};

const User = mongoose.model("User", userSchema);

export default User;
