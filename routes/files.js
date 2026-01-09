// routes/files.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("📄 Files route is working");
});

module.exports = router;
