// ./routes/auth.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../controllers/authController");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/login", auth.loginPage);
router.post("/login", auth.login);
router.get("/register", auth.registerPage);
router.post("/register", auth.register(prisma));
router.get("/logout", auth.logout);

module.exports = router;
