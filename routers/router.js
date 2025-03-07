import express from "express";
import {
  login,
  logout,
  getCurrentUser,
  getRandomUser,
  getAllUsers,
  addUser,
  viewUser,
  editUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticate, isAdmin } from "../middlewares/userMiddleware.js";

const router = express.Router();

router.delete("/user/:id/delete", authenticate, isAdmin, deleteUser);
router.put("/user/:id/edit", authenticate, editUser);
router.get("/user/:id/view", authenticate, viewUser);

router.get("/user/current", authenticate, getCurrentUser);
router.post("/user/add", authenticate, isAdmin, addUser);

router.post("/logout", authenticate, logout);
router.post("/login", login);

router.get("/users", authenticate, getAllUsers);

router.get("/", authenticate, getRandomUser);

export default router;
