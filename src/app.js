require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const statusRoutes = require("./routes/statusRoutes");
const followRoutes = require("./routes/followRoutes");
const userRoutes = require("./routes/userRoutes");
const { swaggerUi, specs } = require("../swagger");
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
 app.use("/auth", authRoutes);
 app.use("/user", userRoutes);
 app.use("/status", statusRoutes);
 app.use("/follow", followRoutes);

// Swagger Documentation
 app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

module.exports = app;
