// ./routes/folders.js
const express = require("express");
const { ensureAuthenticated } = require("../middleware/auth");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// List all folders for user
router.get("/", ensureAuthenticated, async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
    include: { files: true },
    orderBy: { createdAt: "desc" },
  });
  res.render("index", { folders });
});

// Create new folder
router.post("/", ensureAuthenticated, async (req, res) => {
  const { name } = req.body;
  await prisma.folder.create({
    data: { name, userId: req.user.id },
  });
  res.redirect("/folders");
});

// View folder details
router.get("/:id", ensureAuthenticated, async (req, res) => {
  const folder = await prisma.folder.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { files: true },
  });
  if (!folder) return res.status(404).send("Folder not found");
  res.render("folder", { folder });
});

module.exports = router;
