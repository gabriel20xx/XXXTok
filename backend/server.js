// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const sharp = require("sharp");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const SMB2 = require("smb2");

const app = express();
app.use(cors());
app.use(express.json());

// Configure SMB connection
const smb2Client = new SMB2({
  share: '\\\\192.168.2.5\\Generated', // SMB share path
  username: 'gabriel',
  password: 'KingPong31:)',
  domain: '', // Leave blank for no domain
});

mongoose
  .connect("mongodb://192.168.2.94:27017/xxxtok")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));


app.get('/', (req, res) => {
  res.status(200).send('Webpage is running');
})

// Serve WebP images from the 'media' folder
app.use('/media', express.static(path.join(__dirname, 'media')));

app.use(express.static(path.join(__dirname, "..", "frontend")));

// Route to serve a specific WebP image
app.get('/media/:name', (req, res) => {
  const imageName = req.params.name + '.webp';
  const smbPath = '\\' + 'ComfyUI' + '\\' + imageName;  // Path to the file on the SMB share

  smb2Client.readFile(smbPath, (err, fileData) => {
    if (err) {
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', 'image/webp');
    res.send(fileData); // Send the file data from SMB share
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
