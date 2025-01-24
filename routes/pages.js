const { Router } = require("express");
const pageRouter = Router();

const authenticate = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
};

pageRouter.get("/", authenticate, (req, res) => {
  res.redirect("/home");
});

pageRouter.get("/failure", (req, res) =>
  res.render("failure", { title: "Oops!" })
);

pageRouter.get("/home", authenticate, (req, res) => {
  res.render("home", { title: "Clubhouse | Home", user: req.user.first_name });
});

module.exports = { pageRouter };
