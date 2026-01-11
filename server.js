//server.js
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./prisma/client"); // use centralized Prisma

const app = express();

/* VIEW ENGINE */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* MIDDLEWARE */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* SESSIONS */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  })
);

/* PASSPORT */
require("./config/passport")(passport, prisma);
app.use(passport.initialize());
app.use(passport.session());

/* ROUTES */
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/folders", require("./routes/folders"));
app.use("/files", require("./routes/files"));

/* ERRORS */
app.use((req, res) => res.status(404).render("404", { user: req.user }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("500", { user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
