// ./routes/folders.js
const express = require("express");
const { ensureAuthenticated } = require("../middleware/auth");
const folderController = require("../controllers/folderController");
const prisma = require("../prisma/client");

const router = express.Router();

router.get("/:id", ensureAuthenticated, folderController.details(prisma));

router.post("/:id/delete", ensureAuthenticated, async (req, res) => {
  const folderId = Number(req.params.id);

  try {
    await prisma.file.deleteMany({ where: { folderId } });
    await prisma.folder.delete({ where: { id: folderId } });
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.redirect("/");
  }
});

module.exports = router;
