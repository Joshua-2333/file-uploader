// ./routes/folders.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { ensureAuthenticated } = require("../middleware/auth");
const folderController = require("../controllers/folderController");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/:id", ensureAuthenticated, folderController.details(prisma));

module.exports = router;
