// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const sharp = require("sharp");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const port = 5000;
const modelsPath = path.join(__dirname, "../../mnt/models");

const app = express();
app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Views are in /my-app/src/views

// Serve static files from /my-app/src/public
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

const imagesRoutes = require("./routes/images");
app.use("/images", imagesRoutes);
const tabsRoutes = require("./routes/tabs");
app.use("/tabs", tabsRoutes);

mongoose
  .connect("mongodb://192.168.2.94:27017/xxxtok")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Read the filenames in the directory
fs.readdirSync(modelsPath).forEach((file) => {
  // Get the route by stripping the extension from the filename
  const route = "/" + path.basename(file, path.extname(file));
});

// Read the filenames in the models directory and create route names once
const routeNames = fs.readdirSync(modelsPath).map((file) => path.basename(file, path.extname(file)));

// Dynamically create endpoints based on route names
routeNames.forEach((route) => {
  app.get(`/${route}`, (req, res) => {
    // Handle the request for each dynamically created route
    res.render("index", { title: "Home Page" });
  });
});

// Endpoint to fetch available route names dynamically
app.get("/api/routes", (req, res) => {
  console.log(routeNames);
  res.json(routeNames); // Send the list of routes as JSON
});

// Start the server
app.listen(port, () => {
  console.log("Server is running on port 5000");
});
