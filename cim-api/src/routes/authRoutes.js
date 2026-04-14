import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

console.log("Auth Routes Loaded");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post(
  "/register",
  (req, res, next) => {
    console.log("Register route hit");
    next();
  },
  authController.register,
);

export default router;
