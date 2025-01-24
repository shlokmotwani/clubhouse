const { Router } = require("express");
const { validateUserData } = require("../scripts/form-validator");
const { validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const authRouter = Router();

authRouter.get("/sign-up", (req, res) => {
  res.render("sign-up-form", { title: "Sign Up" });
});

authRouter.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/home");
  }
  res.render("login", { title: "Log In" });
});

authRouter.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

authRouter.post("/sign-up", validateUserData, async (req, res, next) => {
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

authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/failure",
    failureMessage: true,
  })
);

module.exports = { authRouter };