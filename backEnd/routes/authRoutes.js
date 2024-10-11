const express = require("express");
// const {signupController, signinController} = require('../controllers/authController');
const { signin, signup } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.send("Used auth route");
});

module.exports = authRouter;
