require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const CPS = require("connect-pg-simple")(session);
const bcrypt = require("bcryptjs");
const { validateUser } = require("./scripts/form-validator");
const { validationResult } = require("express-validator");
const { pool } = require("./config/pool");
const PORT = process.env.PORT || 3000;

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

const authenticate = (req, res, next) => {
  console.log("authenticate called");
  if (req.user) {
    res.redirect("/home", { title: "Clubhouse | Home" });
  }
  next();
};

passport.use(
  new LocalStrategy(async function (email, password, done) {
    try {
      console.log("LOCAL STRATEGY REACHED");
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      const user = rows[0];
      console.log("USER = " + user);
      if (!user) {
        return done(null, false, { message: "Email address not registered." });
      }
      console.log(user);

      const match = bcrypt.match(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/", authenticate, (req, res) => {
  res.redirect("/login");
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up-form", { title: "Sign Up" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Log In" });
});

app.post("/sign-up", validateUser, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up-form", {
      title: "Sign Up",
      errors: errors.array(),
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
      [req.body.firstName, req.body.lastName, req.body.email, hashedPassword]
    );
    res.redirect("/home");
  } catch (err) {
    return next(err);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/failure",
  })
);

// app.post('/login', function(req, res, next) {
//   console.log(req.url);
//   passport.authenticate('local', function(err, user, info) {
//       console.log("authenticate");
//       console.log(err);
//       console.log(user);
//       console.log(info);
//   })(req, res, next);
// });

app.get("/failure", (req, res) => res.send("failure" + req.user));

app.get("/home", authenticate, (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server started and is listening to port:${PORT}`);
});
