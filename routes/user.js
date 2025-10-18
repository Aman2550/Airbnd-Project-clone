const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
const user = require("../models/user.js");

//signup form and signup process
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));



//login form and login process
  router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );


//  Logout Route
router.get("/logout", userController.logout);

module.exports = router;



// //  Signup Routes
// router.get("/signup", userController.renderSignupForm);
// router.post("/signup", wrapAsync(userController.signup));



// //  Login Routes
// router.get("/login", userController.renderLoginForm);
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );



//search
// router.get("/search",userController.searching)