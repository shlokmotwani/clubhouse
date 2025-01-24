const validateMessage = (req, res, next) => {
  if (req.body.secretMessage !== process.env.SECRET_MESSAGE) {
    return res.status(400).render("invalid-message", {
      title: "Not a member",
      message: "Incorrect secret message entered",
    });
  }
  next();
};

module.exports = { validateMessage };
