require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const { Pool } = require("pg");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: "",
  user: "",
  password: "",
  database: "",
  port: "",
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set(express.urlencoded({ extended: true }));

passport.use(new LocalStrategy(async (username, password, done) => {}));

passport.serializeUser((user, done) => {});

passport.deserializeUser(async (id, done) => {});

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.listen(PORT, () => {
  console.log(`Server started and is listening to port:${PORT}`);
});
