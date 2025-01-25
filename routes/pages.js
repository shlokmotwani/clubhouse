const { Router } = require("express");
const { pool } = require("../config/pool");
const { queries } = require("../scripts/queries");
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

pageRouter.get("/home", authenticate, async (req, res, next) => {
  let data;
  try {
    if (req.user.membership === "y") {
      const { rows } = await queries.displayMessagesToMembers();
      data = rows;
    } else {
      const { rows } = await queries.displayMessagesToUsers();
      data = rows;
    }
    res.render("home", {
      title: "Clubhouse | Home",
      user: req.user,
      messages: data,
    });
  } catch (err) {
    next(err);
  }
});

pageRouter.get("/become-a-member", authenticate, (req, res) => {
  res.render("membership-form", { title: "Become a member!" });
});

pageRouter.get("/write", authenticate, (req, res) => {
  res.render("write", { title: "Write a message!" });
});

pageRouter.post("/write", authenticate, async (req, res, next) => {
  try {
    const userID = req.user.id;
    const params = {
      title: req.body.title,
      content: req.body.content,
      timestamp: new Date(),
      userID,
    };
    await queries.addMessage(params);
    return res.redirect("/home");
  } catch (err) {
    next(err);
  }
  res.render("write", { title: "Write a message!" });
});

module.exports = { pageRouter };
