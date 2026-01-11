// controllers/authController.js
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.loginPage = (req, res) =>
  res.render("login", { user: req.user });

exports.registerPage = (req, res) =>
  res.render("register", { user: req.user });

exports.register = (prisma) => async (req, res) => {
  const { email, username, password } = req.body;

  if (!password || password.length < 6) {
    return res.redirect("/auth/register");
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: { email, username, password: hashed },
    });
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.redirect("/auth/register");
  }
};

exports.login = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
});

exports.logout = (req, res, next) => {
  req.logout(err => (err ? next(err) : res.redirect("/auth/login")));
};
