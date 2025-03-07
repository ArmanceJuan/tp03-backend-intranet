import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";

// ======
// Login
// ======

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("Password from DB:", user.password);

    if (!user.comparePassword(password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userDataWithoutPassword = {
      id: user._id,
      gender: user.gender,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
      city: user.city,
      country: user.country,
      photo: user.photo,
      category: user.category,
      isAdmin: user.isAdmin,
    };

    res.status(200).json({
      message: "Login successful",
      token: `Bearer ${token}`,
      user: userDataWithoutPassword,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }
};

// ======
// Logout
// ======

export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out user", error: error.message });
  }
};

// ============
// Random users
// ============

export const getRandomUser = async (req, res) => {
  try {
    const count = await User.countDocuments();
    const random = Math.floor(Math.random() * count);
    const randomUser = await User.findOne().skip(random);

    if (!randomUser) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json({
      message: "Random user",
      user: randomUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting random user", error: error.message });
  }
};

// =========
// All users
// =========

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "All users", users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting all users", error: error.message });
  }
};

// =========
// Add users
// =========

export const addUser = async (req, res) => {
  try {
    const {
      gender,
      firstname,
      lastname,
      email,
      password,
      phone,
      birthdate,
      city,
      country,
      photo,
      category,
      isAdmin,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (
      !gender ||
      !firstname.trim() ||
      !lastname.trim() ||
      !email.trim() ||
      !password.trim() ||
      !phone ||
      !birthdate ||
      !city.trim() ||
      !country.trim() ||
      !category
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const newUser = new User({
      gender,
      firstname,
      lastname,
      email,
      password,
      phone,
      birthdate,
      city,
      country,
      photo:
        photo ||
        "https://i.pinimg.com/736x/67/b2/cc/67b2cc4e28fcf735c303f1d43c1bd698.jpg",
      category,
      isAdmin: isAdmin || false,
    });

    newUser.password = newUser.hashPassword(password);
    await newUser.save();

    res.status(201).json({
      message: "User added successfully",
      user: {
        id: newUser._id,
        gender: newUser.gender,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        phone: newUser.phone,
        birthdate: newUser.birthdate,
        city: newUser.city,
        country: newUser.country,
        photo: newUser.photo,
        category: newUser.category,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding user", error: error.message });
  }
};

// ==========
// View user
// ==========

export const viewUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// ==========
// Edit user
// ==========

export const editUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      gender,
      firstname,
      lastname,
      email,
      password,
      phone,
      birthdate,
      city,
      country,
      photo,
      category,
      isAdmin,
    } = req.body;

    if (
      !gender ||
      !firstname.trim() ||
      !lastname.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !birthdate ||
      !city.trim() ||
      !country.trim() ||
      !category
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (user.email !== email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.gender = gender;
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.phone = phone;
    user.birthdate = birthdate;
    user.city = city;
    user.country = country;
    user.photo = photo || user.photo;
    user.category = category;

    if (req.user && req.user.isAdmin) {
      user.isAdmin = isAdmin;
    }

    if (password) {
      user.password = user.hashPassword(password);
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        gender: user.gender,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        birthdate: user.birthdate,
        city: user.city,
        country: user.country,
        photo: user.photo,
        category: user.category,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// ===========
// Delete user
// ===========

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// ============
// Current user
// ============

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      user: {
        id: user._id,
        gender: user.gender,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        birthdate: user.birthdate,
        city: user.city,
        country: user.country,
        photo: user.photo,
        category: user.category,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting current user", error: error.message });
  }
};
