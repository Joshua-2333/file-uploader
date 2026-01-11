// ./routes/index.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { ensureAuthenticated } = require("../middleware/auth");
const folderController = require("../controllers/folderController");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", ensureAuthenticated, folderController.list(prisma));
router.post("/folders", ensureAuthenticated, folderController.create(prisma));

module.exports = router;
