const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const fetch = require("node-fetch"); // ya axios

const upload = multer({ dest: "uploads/" });

// POST /api/gemini/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const fileBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

    const response = await fetch("https://api.gemini.com/v1/analyze", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: fileBase64,
        filename: req.file.originalname,
      }),
    });

    const result = await response.json();

    fs.unlinkSync(req.file.path); // clean up

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

module.exports = router;
