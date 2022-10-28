const permissions = require("./../../models/permissions");
const controller = require("./../controller");
exports.showAll = async (req, res, next) => {
  let page = req.query.page || 1;
  let Permissions = await permissions.paginate(
    {},
    { page, sort: { createdAt: -1 }, limit: 10 }
  );
  res.render("admin/permissions/permissions", {
    Permissions,
    layout: "layoutAdmin",
    user: req.user.name,
  });
};
exports.createShow = async (req, res, next) => {
  let Permissions = await permissions.find({});
  res.render("admin/permissions/createPermissions", {
    layout: "layoutAdmin",
    user: req.user.name,
    Permissions,
  });
};
exports.create = async (req, res, next) => {
  try {
    let status = await controller.validationData(req);
    if (!status) return controller.back(req, res);
    let { name, label } = req.body;
    let newPermissions = new permissions({
      name,
      label,
    });
    await newPermissions.save();
    return res.redirect("/admin/users/permissions");
  } catch (err) {
    next(err);
  }
};
exports.editShow = async (req, res, next) => {
  try {
    controller.isMongoId(req.params.id);
    let Permission = await permissions.findById(req.params.id);
    let Permissions = await permissions.find({});
    if (!Permission) controller.error("چنین دسته ای وجود ندارد", 404);
    return res.render("admin/permissions/editPermissions", {
      Permission,
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
    let { name, label } = req.body;
    await permissions.findByIdAndUpdate(req.params.id, {
      $set: {
        name,
        label,
      },
    });
    return res.redirect("/admin/users/permissions");
  } catch (err) {
    next(err);
  }Permissions
};
exports.delete = async (req, res, next) => {
  try {
    controller.isMongoId(req.params.id);
    let Permissions = await permissions
      .findById(req.params.id)
      .populate("roles")
      .exec();
    if (!Permissions) this.error("چنین دسته ای وجود ندارد", 404);
    // delete category
    Permissions.remove();
    return res.redirect("/admin/users/permissions");
  } catch (err) {
    next(err);
  }
};
