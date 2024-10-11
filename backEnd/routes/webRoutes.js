const express = require("express");
const path = require("path");
const authMiddleware = require("../middlewares/authMiddleware.js");
const userController = require("../controllers/userController.js");

//for serving html files built with bootstrap with bootstrap styling

const webRouter = express();

// webRouter.use(express.static(path.join(__dirname, "public")));
// webRouter.use(express.static(path.join(__dirname, "../../frontEnd")));

webRouter.use(express.json());

// use the routes

// define a default home route
webRouter.get("/", (req, res) => {
  console.log("inside web route for HMS file");
  res.sendFile(path.join(__dirname, "../../frontEnd/HMS.html"));
  //   res.send("Welcome to healthcare management system");
});

// signup page
webRouter.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontEnd/signup.html"));
  //   res.send("Welcome to healthcare management system");
});

// signin page
webRouter.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontEnd/signin.html"));
  //   res.send("Welcome to healthcare management system");
});

// dashboard page (protected)
webRouter.get("/dashboard", authMiddleware, (req, res) => {
  console.log("sending response from dashboard");

  //assuming authMiddleware sets req.user if token is valid
  if (req.user) {
    res.sendFile(path.join(__dirname, "../../frontEnd/dashboard.html"));
  } else {
    req.status(401).json({ message: "unauthorized" });
  }
});

// profile page
webRouter.get("/profile", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontEnd/profile.html"));
  //   res.send("Welcome to healthcare management system");
});

//auth routes
webRouter.post('/api/signup', userController.signup );
webRouter.post('/api/signin', userController.signin );


//catch error for non existent routes/pages
webRouter.get('/', (req, res) => {
  res.status(404).send('Page not found');
})

module.exports = webRouter;
