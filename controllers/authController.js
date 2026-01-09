// controllers/authController.js
const bcrypt = require("bcryptjs");
const passport = require("passport");

module.exports = {
  // Render login page
  loginPage: (req, res) => {
    res.render("login");
  },

  // Render register page
  registerPage: (req, res) => {
    res.render("register");
  },

  // Handle registration
  register: async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.render("register", { error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.render("register", { error: "Passwords do not match" });
    }

    try {
      const existingUser = await req.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.render("register", { error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await req.prisma.user.create({
        data: { email, password: hashedPassword },
      });

      res.redirect("/auth/login");
    } catch (err) {
      console.error(err);
      res.render("register", { error: "Something went wrong" });
    }
  },

  // Handle login
  login: (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
      failureFlash: true,
    })(req, res, next);
  },

  // Handle logout
  logout: (req, res) => {
    req.logout(err => {
      if (err) console.error(err);
      res.redirect("/auth/login");
    });
  },
};
