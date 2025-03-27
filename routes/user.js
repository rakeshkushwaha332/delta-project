const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users");
const wrapAsync = require("../utils/wrapAsync");

// Show signup form
router.get("/signup", userController.renderSignupForm);

// Handle signup logic
router.post("/signup", wrapAsync(userController.signup));

// Show login form
router.get("/login", userController.renderLoginForm);

// Handle login logic (using passport local strategy)
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// Handle logout
router.get("/logout", userController.logout);

module.exports = router;
