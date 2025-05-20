// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
router.post("/", upload.single("file"), (req, res) => {
  try {
    console.log("Uploaded file:", req.file);
    res.status(200).json({ filename: "uploads/" + req.file.filename });
  } catch (e) {
    console.log("Upload error:", e);
    res.status(500).json({ error: "File upload failed" });
  }
});

module.exports = router;
