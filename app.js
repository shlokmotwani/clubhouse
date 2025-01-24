require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const CPS = require("connect-pg-simple")(session);
const { pool } = require("./config/pool");
const { authRouter } = require("./routes/auth");
const { pageRouter } = require("./routes/pages");
const PORT = process.env.PORT || 3002;

const app = express();

const sessionStore = new CPS({
  pool: pool,
});

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "partials"),
]);
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "cats",
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    cookie: { maxAge: 600000 },
  })
);
app.use(passport.session());

app.use(authRouter);
app.use(pageRouter);

app.listen(PORT, () => {
  console.log(`Server started and is listening to port:${PORT}`);
});
