const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");
const loginValidator = require("./../validators/loginValidator");
const signupValidator = require("./../validators/signupValidator");
const forgotPasswordValidator = require("./../validators/forgotPasswordValidator");
const resetPasswordValidator = require("./../validators/resetPasswordValidator");
router.get("/login", authController.loginView);
router.get("/signup", authController.signupView);
router.post("/login", loginValidator.handle(), authController.loginProcess);
router.post("/signup", signupValidator.handle(), authController.signupProcess);
router.get("/logout", authController.logoutProcess);
router.get("/forgotpassword", authController.forgotPasswordView);
router.post(
  "/forgotpassword",
  forgotPasswordValidator.handle(),
  authController.forgotPasswordProcess
);
router.patch("resetpassword/:id", authController.resetPasswordProcess);
router.get(
  "/updatepassword",
  resetPasswordValidator.handle(),
  authController.updatePasswordView
);
router.patch("/updatepassword", authController.updatePasswordProcess);
module.exports = router;
