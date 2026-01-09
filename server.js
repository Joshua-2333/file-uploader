//server.js
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const prisma = new PrismaClient();
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
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // clean expired sessions every 2 minutes
      dbRecordIdIsSessionId: true, // ensures session IDs match DB records
    }),
  })
);

/* PASSPORT */
require("./config/passport")(passport, prisma); // make sure Prisma is passed

app.use(passport.initialize());
app.use(passport.session());

/* ROUTES */
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/folders", require("./routes/folders"));
app.use("/files", require("./routes/files"));

/* 404 ERROR HANDLER */
app.use((req, res, next) => {
  res.status(404).render("404");
});

/* 500 ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error(err.stack); // log the error
  res.status(500).render("500");
});

/* SERVER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
