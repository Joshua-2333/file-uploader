// ./routes/auth.js
const express = require("express");
const auth = require("../controllers/authController");
const prisma = require("../prisma/client");

const router = express.Router();

router.get("/login", auth.loginPage);
router.post("/login", auth.login);
router.get("/register", auth.registerPage);
router.post("/register", auth.register(prisma));
router.get("/logout", auth.logout);

module.exports = router;
