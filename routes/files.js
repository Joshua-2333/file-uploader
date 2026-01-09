// ./routes/files.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { ensureAuthenticated } = require("../middleware/auth");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, "").replace(/\s+/g, "_");
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Upload file
router.post("/upload", ensureAuthenticated, upload.single("file"), async (req, res) => {
  const { folderId } = req.body;
  if (!req.file) return res.status(400).send("No file uploaded");

  await prisma.file.create({
    data: {
      name: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      folderId: parseInt(folderId),
      userId: req.user.id,
    },
  });

  res.redirect(`/folders/${folderId}`);
});

// Download file
router.get("/:id/download", ensureAuthenticated, async (req, res) => {
  const file = await prisma.file.findUnique({ where: { id: parseInt(req.params.id) } });
  if (!file) return res.status(404).send("File not found");
  res.download(file.path, file.name);
});

// Delete file
router.post("/:id/delete", ensureAuthenticated, async (req, res) => {
  const file = await prisma.file.findUnique({ where: { id: parseInt(req.params.id) } });
  if (!file) return res.status(404).send("File not found");

  // Delete from filesystem
  fs.unlinkSync(file.path);

  await prisma.file.delete({ where: { id: file.id } });
  res.redirect(`/folders/${file.folderId}`);
});

module.exports = router;
