const { Router } = require("express");
const { pool } = require("../config/pool");
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
  res.render("home", { title: "Clubhouse | Home", user: req.user });
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
    await pool.query(
      "INSERT INTO messages(title, content, timestamp, user_id) VALUES ($1, $2, $3, $4)",
      [req.body.title, req.body.content, new Date(), userID]
    );
    return res.redirect("/home");
  } catch (err) {
    next(err);
  }
  res.render("write", { title: "Write a message!" });
});

module.exports = { pageRouter };
