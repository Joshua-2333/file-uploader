// controllers/authController.js
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  loginPage(req, res) {
    res.render("login", { user: req.user });
  },

  registerPage(req, res) {
    res.render("register", { user: req.user });
  },

  async register(req, res) {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.render("register", {
        user: null,
        error: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.render("register", {
        user: null,
        error: "Passwords do not match",
      });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.render("register", {
          user: null,
          error: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: { email, password: hashedPassword },
      });

      res.redirect("/auth/login");
    } catch (err) {
      console.error(err);
      res.status(500).render("500", { user: null });
    }
  },

  login(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
    })(req, res, next);
  },

  logout(req, res, next) {
    req.logout(err => {
      if (err) return next(err);
      res.redirect("/auth/login");
    });
  },
};
