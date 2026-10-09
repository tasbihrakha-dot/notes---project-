
require("dotenv").config();

const express = require("express");
const AppDataSource = require("./db");
const authRoutes = require("./authRoutes");
const notesRoutes = require("./notesRoutes");

const app = express();

// Read JSON data from requests
app.use(express.json());

// Authentication routes: register and login
app.use("/auth", authRoutes);

// Notes routes: GET, POST, PUT, DELETE and Search
app.use("/notes", notesRoutes);

// Server port
const port = process.env.PORT || 5000;

// Connect to database, then start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });