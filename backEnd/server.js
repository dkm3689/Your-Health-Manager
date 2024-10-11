const express = require("express");
const dotenv = require("dotenv");

// import routes
const authRoutes = require("./routes/authRoutes.js");
const webRoutes = require("./routes/webRoutes.js");
const healthRecordRoutes = require("./routes/healthRecordRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");


dotenv.config();
const app = express();

// for performing perform cryptographic operations like Hashing data
// (e.g., using SHA-256) Encrypting and decrypting data
// const { webcrypto } = require("crypto");



// CORS configuration
const corsOptions =  {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

// serving static files for bootstrap styling
app.use(express.static(path.join(__dirname, "../frontEnd")));
app.use(express.json());
// app.use(bodyParser.json());
app.use(cors(corsOptions));


// connect to MongoDB database
const mongoURI = process.env.MONGO_URI; // Make sure this is correctly loaded
console.log("MongoDB URI:", mongoURI); // Check the logged output
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));


//rate limit
// allowing 100 api calls in 15 mins
const limiter = rateLimit({
  wondowMS: 15*60*1000,
  max: 100
});

//usaed as a middleware just like cors and express json
app.use(limiter);


  // use the routes
// app.use('/api/user', userRouter);
app.use("/api/auth", authRoutes);
app.use("/", webRoutes);
app.use("/api/users", userRoutes);
app.use("/api/health-record", healthRecordRoutes);

//any other route will be handled below
//internal server error will be handled below
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("internal server error");
});

// start the server
const PORT = process.env.PORT || 3500;

// start the server listening on the specified port or default port 3500
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
