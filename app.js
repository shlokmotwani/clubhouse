require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const { Pool } = require("pg");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { validateUser } = require("./scripts/form-validator");
const { validationResult } = require("express-validator");
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  host: "localhost",
  user: "a",
  password: "a",
  database: "clubhouse",
  port: 5432,
});

const app = express();

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "partials"),
]);
app.use(express.urlencoded({ extended: true }));

passport.use(new LocalStrategy(async (username, password, done) => {}));

passport.serializeUser((user, done) => {});

passport.deserializeUser(async (id, done) => {});

app.get("/", (req, res) => {
  //   res.render("index", { title: "Home" });
  res.redirect("/sign-up");
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up-form", { title: "Sign Up" });
});

app.post("/sign-up", validateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up-form", {
      title: "Sign Up",
      errors: errors.array(),
    });
  }
  return res.send("Signed Up!!");
});

app.listen(PORT, () => {
  console.log(`Server started and is listening to port:${PORT}`);
});
