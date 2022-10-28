const controller = require("./controller");
const user = require("./../models/users");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require('util');
const sendEmail = require("./../middleware/email");
const { EventEmitter } = require("stream");
const { read } = require("fs");
const { options } = require("../app");
const { REPLServer } = require("repl");
exports.signupView = (req, res, next) => {
  res.render("home/auth/signup");
};
const signToken = (id) => {
  //CREATING TOKEN
  return JWT.sign({ id } ,process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIREDATE,
  });
};
//CONVERT TOKEN TO COOKIE
const createSendToken = (user, res) => {
  const token = signToken(user._id);
  res.cookie("token", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 60 * 24 * 1000
    ),
    secure: true,
    httpOnly: true,
  });
  user.passwordConfirm = undefined;
};
exports.signupProcess = async (req, res, next) => {
  let result = await controller.validationData(req);
  if (result) {
    const newUser = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phoneNumber: req.body.phoneNumber,
    });
    createSendToken(newUser, res);

    res.redirect("/");
  }

  return controller.back(req, res);
};
exports.loginView = (req, res) => {
  res.render("home/auth/login",{cookies : req.cookies.token});
};
exports.loginProcess = async (req, res, next) => {
  const { email, password } = req.body;
  let result = await controller.validationData(req);
  if (result) {
    const User = await user.findOne({ email }).select("+password");
    createSendToken(User, res);
    controller.alert(req,{
      title : 'LogIn Success',
      message : 'ENJOY',
      type : 'success',
      timer : '4000'
    })
    res.redirect('/')
  }
};
exports.logoutProcess = async (req, res, next) => {
  try {
    if (req.cookies.token) {
      res.cookie("token", "", { expires: new Date() });
      controller.alert(req,{
        title : 'LogOut Success',
        message : 'ENJOY',
        type : 'success',
        timer : '4000'
      })
      res.redirect("/");
    }
  } catch (err) {
    throw err.message;
  }
};
exports.forgotPasswordView = (req, res, next) => {
  res.render("home/auth/resetpassword/email" , {cookies : req.cookies.token});
};
exports.forgotPasswordProcess = async (req, res, next) => {
  try {
    //1 GET USER ON POSTED EMAIL
    const User = await user.findOne({ email: req.body.email });
    if (!User) {
      throw new Error("user can not be found");
    }
    //2 GENERATE RANDOM RESET TOKEN
    const resetToken = User.createPasswordResetToken();
    await User.save({ validateBeforeSave: false });
    //3 SEND TO USER EMAIL
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/users/resetPassword/${resetToken}`;
    const message = `forgot your password ? click : ${resetUrl} `;
    try {
      await sendEmail({
        email: User.email,
        subject: "your password reset token ( valid for 10 min )",
        message,
      });
      res.redirect("/auth/updatepassword");
    } catch (err) {
      User.passwordResetToken = undefined;
      User.passwordResetExpires = undefined;
      await User.save({ validateBeforeSave: false });
      return new Error("there was an error sending the email token");
    }
  } catch (err) {
    throw err.message;
  }
};
exports.resetPasswordProcess = async (req, res, next) => {
  try {
    //1 get user based on the token
    const hashedToken = crypto
      .createHash("hsa256")
      .update(req.params.token)
      .digest("hex");
    const User = await user.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });
    //2 if token was not expired, and there is user, set the new password
    if (!User) {
      throw new Error("user cannot be found !!!!");
    }
    User.password = req.body.password;
    User.password = req.body.passwordConfirm;
    User.passwordResetToken = undefined;
    User.passwordResetExpires = undefined;
    await User.save();
    //3 log the user in , send jwt
    createSendToken(User, 200, res);
    next();
  } catch (err) {
    throw err.message;
  }
};
exports.updatePasswordView = async (req, res, next) => {
  res.render("home/auth/resetPassword/updatepassword" , {cookies : req.cookies.token});
};
exports.updatePasswordProcess = async (req, res, next) => {
  try {
    //1 get user from collection
    const User = user.findById(req.body.id).select("+password");
    //2 check if posted current password is correct
    if (!(await User.comparePassword(req.body.passwordCurrent, req.password))) {
      return new appError("your current password is wrong", 401);
    }
    //3 if yes update password
    User.password = req.body.password;
    User.passwordConfirm = req.body.passwordConfirm;
    await User.save();

    //4 log user in sed JWT
    createSendToken(User, 200, res);
    next();
  } catch (err) {
    throw err.message;
  }
};
exports.protect = async (req, res, next) => {
  
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      req.flash('token is not available')
    }
  
    // 2) Verification token
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
  
    // 3) Check if user still exists
    const currentUser = await user.findById(decoded.id);
    if (!currentUser) {
      req.flash('NO USER')
    }
  
    // 4) Check if user changed password after the token was issued
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //   console.log('eeeeee')
    // }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  }
exports.restrictTo = (...roles)=>{
  return(req,res,next)=>{
    if(!roles.includes(req.user.role)){
       return res.redirect('/')
    }
    next()
  }
}
exports.checkCurrentUser = async (req,res,next)=>{
  const token = req.cookies.token
  if(token){
    JWT.verify(token,process.env.JWT_SECRET , async (err,decodedToken)=>{
      if(err){
        console.log(err.message)
        res.locals.user = null
        req.user = null
        next()
      }
      else{
        let currentUser = await user.findById(decodedToken.id)
        req.user = currentUser
        res.locals.user = currentUser
        next()
      }
    })
  }
  else{
    res.locals.user = null
    req.user = null
    next()
  }
}