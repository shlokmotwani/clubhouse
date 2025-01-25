const { Router } = require("express");
const { validateUserData } = require("../scripts/form-validator");
const { validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/pool");
const { validateMessage } = require("../scripts/member-validator");
const { queries } = require("../scripts/queries");

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
      const params = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        hashedPassword,
        membership: "y",
        isadmin: "y",
      };
      queries.addAdmin(params);
    } else {
      const params = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        hashedPassword,
      };
      queries.addUser(params);
    }
    res.redirect("/home");
  } catch (err) {
    return next(err);
  }
});

authRouter.post("/become-a-member", validateMessage, async (req, res, next) => {
  try {
    const params = {
      email: req.user.email,
    }
   queries.updateMembership(params);
    return res.redirect("/home");
  } catch (err) {
    next(err);
  }
});

authRouter.post("/delete-message", async (req, res, next) => {
  console.log(req.body.messageID);
  try {
    const params = {
      messageID: req.body.messageID,
    }
    queries.deleteMessage(params);
    res.redirect("/home");
  } catch (err) {
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
