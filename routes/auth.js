const { Router } = require("express");
const { validateUserData } = require("../scripts/form-validator");
const { validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/pool");
const { validateMessage } = require("../scripts/member-validator");

const authRouter = Router();

authRouter.get("/sign-up", (req, res) => {
  res.render("sign-up-form", { title: "Sign Up" });
});

authRouter.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/home");
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
    if (
      req.body.secretMessageForAdmins &&
      req.body.secretMessageForAdmins === process.env.SECRET_ADMIN_MESSAGE
    ) {
      await pool.query(
        "INSERT INTO users (first_name, last_name, email, password, membership, isadmin) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          req.body.firstName,
          req.body.lastName,
          req.body.email,
          hashedPassword,
          "y",
          "y",
        ]
      );
    } else {
      await pool.query(
        "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
        [req.body.firstName, req.body.lastName, req.body.email, hashedPassword]
      );
    }
    res.redirect("/home");
  } catch (err) {
    return next(err);
  }
});

authRouter.post("/become-a-member", validateMessage, async (req, res, next) => {
  try {
    await pool.query(`UPDATE users SET membership = 'y' WHERE email = $1`, [
      req.user.email,
    ]);
    return res.redirect("/home");
  } catch (err) {
    next(err);
  }
});

authRouter.post("/delete-message", async (req, res, next) => {
  console.log(req.body.messageID);
  try{
    await pool.query("DELETE FROM messages WHERE id = $1", [String(req.body.messageID)]);
    res.redirect("/home");
  }
  catch(err){
    next(err);
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
