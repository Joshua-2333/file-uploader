// ./routes/folders.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { ensureAuthenticated } = require("../middleware/auth");
const folderController = require("../controllers/folderController");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * VIEW FOLDER DETAILS
 * GET /folders/:id
 */
router.get(
  "/:id",
  ensureAuthenticated,
  folderController.details(prisma)
);

/**
 * DELETE FOLDER (and its files)
 * POST /folders/:id/delete
 */
router.post("/:id/delete", ensureAuthenticated, async (req, res) => {
  const folderId = Number(req.params.id);

  try {
    // Delete files inside the folder first
    await prisma.file.deleteMany({
      where: { folderId },
    });

    // Then delete the folder
    await prisma.folder.delete({
      where: { id: folderId },
    });

    res.redirect("/");
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.redirect("/");
  }
});

module.exports = router;
