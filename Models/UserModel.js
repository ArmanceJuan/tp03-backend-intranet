import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    firstname: {
      type: String,
      required: [true, "Please enter your first name"],
      trim: true,
      minlength: [3, "Your first name must be at least 3 characters"],
      maxlength: [50, "Your first name must not exceed 50 characters"],
    },
    lastname: {
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
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    birthdate: {
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
    photo: {
      type: String,
      default:
        "https://i.pinimg.com/736x/67/b2/cc/67b2cc4e28fcf735c303f1d43c1bd698.jpg",
    },
    category: {
      type: String,
      enum: ["Marketing", "Client", "Technique"],
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
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
