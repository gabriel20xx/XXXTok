const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(express.static(path.join(__dirname, "public")));  

const imagesRoutes = require("./routes/images");
const tabsRoutes = require("./routes/tabs");
const { setupDynamicRoutes } = require("./controllers/dynamicRoutesController");

app.use("/images", imagesRoutes);
app.use("/tabs", tabsRoutes);

// Setup dynamic routes
setupDynamicRoutes(app);

mongoose
  .connect("mongodb://192.168.2.94:27017/xxxtok")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

app.listen(port, () => {
  console.log("Server is running on port", port);
});
