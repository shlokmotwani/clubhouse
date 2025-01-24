const { body } = require("express-validator");

const emptyFieldErr = "cannot be empty.";
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 2 and 50 characters.";
const emailErr = "Please enter a valid email address.";
const passwordFormatErr = `Your password must be a minimum of 6 characters long having lowercase letter, uppercase letter, numerical digit and special character (eg. !@#$%^).`;
const passwordMismatchErr = "Passwords do not match.";

const validateUserData = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage(`First name ${emptyFieldErr}`)
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 2, max: 50 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage(`Last name ${emptyFieldErr}`)
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 2, max: 50 })
    .withMessage(`Last name ${lengthErr}`),
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email address ${emptyFieldErr}`)
    .isEmail()
    .withMessage(emailErr),
  body("password")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(passwordFormatErr),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage(passwordMismatchErr),
];

module.exports = { validateUserData };
