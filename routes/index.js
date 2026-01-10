// ./routes/index.js
const express = require("express");
const { ensureAuthenticated } = require("../middleware/auth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
    include: { files: true },
    orderBy: { createdAt: "desc" },
  });

  res.render("index", {
    user: req.user,
    folders,
  });
});

module.exports = router;
