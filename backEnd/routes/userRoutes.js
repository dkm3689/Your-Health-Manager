const express = require("express");
// const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

const userRouter = express();

// secret key
const secretKey = process.env.JWT_SECRET;
// if (!secretKey) {
//   throw new Error("JWT_SECRET environment variable is not set");
// }

// user signup
userRouter.post("/", userController.signup);

//user signin (Generate Token)
userRouter.post("/login", userController.signin);
  

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(403).json({ message: "Token is required" });
    }

    console.log("secret key:", secretKey);
    console.log("token:", token);
  
    try {
      const verified = jwt.verify(token, secretKey);
      req.user = verified;
      next();
    } catch (e) {
      res.status(401).json({ message: "Token is invalid" });
    }
  };

// get user details (protected)
userRouter.get("/", authenticateJWT, userController.getAllUsers);

//get single user detail
userRouter.get("/currentUser", authenticateJWT, userController.getUserDetail);

// update user details (protected)
userRouter.put("/:id", authenticateJWT, userController.updateUser);

// delete user (protected)
userRouter.delete("/:id", authenticateJWT, userController.deleteUser);


module.exports = userRouter;