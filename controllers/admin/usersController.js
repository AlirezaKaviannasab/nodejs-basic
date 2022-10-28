const controller = require("./../controller");
const users = require("./../../models/users");
const roles = require("./../../models/roles");
exports.showUsers = async (req, res, next) => {
  let Users = await users.paginate({
    sort: { createdAt: -1 },
  });
  res.render("admin/users/users", {
    layout: "layoutAdmin",
    Users,
    user: req.user.name,
  });
};

exports.createShow = async (req, res, next) => {
  res.render("admin/users/createUser", {
    layout: "layoutAdmin",
    user: req.user.name,
  });
};
exports.create = async (req, res, next) => {
  try {
    let status = await controller.validationData(req);
    if (!status) {
      return back(req, res);
    }
    // let images = imageResize(req.files.images[0]);

    let { name, email, password, passwordConfirm, phoneNumber, role } =
      req.body;
    let newUser = new users({
      name,
      email,
      phoneNumber,
      password,
      passwordConfirm,
      role,
    });

    await newUser.save();
    newUser.passwordConfirm = undefined;
    return res.redirect("/admin/users/users");
  } catch (err) {
    next(err);
  }
};
exports.destroy = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let User = await users.findById(req.params.id).exec();
  if (!User) controller.error("user can not be found", 404);
  //delete posts
  User.remove();
  return res.redirect("/admin/users/users");
};
exports.editShow = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let Users = await users.findById(req.params.id);
  if (!Users) controller.error("error can not be found", 404);
  return res.render("admin/users/editUser", {
    Users,
    layout: "layoutAdmin",
    user: req.user.name,
  });
};
exports.update = async (req, res, next) => {
  let status = await controller.validationData(req);
  if (!status) {
    return controller.back(req, res);
  }
  await users.findByIdAndUpdate(req.params.id, {
    $set: { ...req.body },
  });
  // redirect back
  return res.redirect("/admin/users/users");
};
exports.addRoleShow = async (req, res, next) => {
  try {
    controller.isMongoId(req.params.id);
    let Users = await users.findById(req.params.id);
    let Roles = await roles.find({});{ roles: req.body.roles }
    if (!Users) controller.error("this user does not found", 404);
    res.render("admin/users/createRoles", {
      Users,
      Roles,
      layout: "layoutAdmin",
      user: req.user.name,
    });
  } catch (err) {
    next(err);
  }
};
exports.addRole = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let Users = await users.findById(req.params.id);
  if (!Users) controller.error("this user does not found", 404);
  let newRoles = {$set : { roles: req.body.roles }};
  await Users.updateOne(newRoles);
  res.redirect("/admin/users/roles");
};
