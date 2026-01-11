// ./routes/files.js
const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/fileController");
const { ensureAuthenticated } = require("../middleware/auth");
const prisma = require("../prisma/client");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({ storage });

router.post(
  "/upload",
  ensureAuthenticated,
  upload.single("file"),
  fileController.upload(prisma)
);
router.get("/:id/download", ensureAuthenticated, fileController.download(prisma));
router.post("/:id/delete", ensureAuthenticated, fileController.delete(prisma));

module.exports = router;
