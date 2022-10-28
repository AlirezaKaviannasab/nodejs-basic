const roles = require("./../../models/roles");
const permissions = require("./../../models/permissions");
const controller = require("./../controller");
exports.showAll = async (req, res, next) => {
  let page = req.query.page || 1;
  let Roles = await roles.paginate(
    {},
    { page, sort: { createdAt: -1 }, limit: 10 }
  );
  res.render("admin/roles/roles", {
    Roles,
    layout: "layoutAdmin",
    user: req.user.name,
  });
};
exports.createShow = async (req, res, next) => {
  let Permissions = await permissions.find({});
  res.render("admin/roles/createRoles", {
    layout: "layoutAdmin",
    user: req.user.name,
    Permissions,
  });
};
exports.create = async (req, res, next) => {
  try {
    let status = await controller.validationData(req);
    if (!status) return controller.back(req, res);
    let { name, label, permissions } = req.body;
    let newRoles = new roles({
      name,
      label,
      permissions
    });
    await newRoles.save();
    return res.redirect("/admin/users/roles");
  } catch (err) {
    next(err);
  }
};
exports.editShow = async (req, res, next) => {
  try {
    controller.isMongoId(req.params.id);
    let Role = await roles.findById(req.params.id);
    let Permissions = await permissions.find({});
    if (!Role) this.error("چنین دسته ای وجود ندارد", 404);
    return res.render("admin/Roles/editRoles", {
      Role,
      Permissions,
      layout: "layoutAdmin",
      user: req.user.name,
    });
  } catch (err) {
    next(err);
  }
};
exports.edit = async (req, res, next) => {
  try {
    let status = await controller.validationData(req);
    if (!status) return controller.back(req, res);
    let { name, label, permissions } = req.body;
    await roles.findByIdAndUpdate(req.params.id, {
      $set: {
        name,
        label,
        permissions
      },
    });
    return res.redirect("/admin/users/roles");
  } catch (err) {
    next(err);
  }Permissions
};
exports.delete = async (req, res, next) => {
  try {
    this.isMongoId(req.params.id);
    let Roles = await roles
      .findById(req.params.id)
      .exec();
    if (!Roles) this.error("چنین دسته ای وجود ندارد", 404);
    // delete 
    Roles.remove();
    return res.redirect("/admin/users/roles");
  } catch (err) {
    next(err);
  }
};
