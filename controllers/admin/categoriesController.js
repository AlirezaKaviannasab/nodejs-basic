const categories = require("./../../models/categories");
const controller = require("./../controller");
exports.showAll = async (req, res, next) => {
  let page = req.query.page || 1;
  let Categories = await categories.paginate(
    {},
    { page, sort: { createdAt: -1 }, limit: 10, populate: "parent" }
  );
  res.render("admin/categories/categories", {
    Categories,
    layout: "layoutAdmin",
    user: req.user.name,
  });
};

exports.createShow = async (req, res, next) => {
  let Categories = await categories.find({ parent: null });
  res.render("admin/categories/createCategories", {
    layout: "layoutAdmin",
    user: req.user.name,
    Categories,
  });
};
exports.create = async (req, res, next) => {
  try {
    let status = await controller.validationData(req);
    if (!status) return controller.back(req, res);

    let { name, parent } = req.body;

    let newCategories = new categories({
      name,
      parent: parent !== "none" ? parent : null,
    });

    await newCategories.save();

    return res.redirect("/admin/categories/categories");
  } catch (err) {
    next(err);
  }
};
exports.editShow = async (req, res, next) => {
  try {
    controller.isMongoId(req.params.id);

    let Category = await categories.findById(req.params.id);
    let Categories = await categories.find({ parent: null });
    if (!Category) this.error("چنین دسته ای وجود ندارد", 404);

    return res.render("admin/categories/editcategories", {
      Category,
      Categories,
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

    let { name, parent } = req.body;

    await categories.findByIdAndUpdate(req.params.id, {
      $set: {
        name,
        parent: parent !== "none" ? parent : null,
      },
    });

    return res.redirect("/admin/categories/categories");
  } catch (err) {
    next(err);
  }
};
exports.delete = async (req, res, next) => {
  try {
    this.isMongoId(req.params.id);

    let Categories = await categories
      .findById(req.params.id)
      .populate("childs")
      .exec();
    if (!Categories) this.error("چنین دسته ای وجود ندارد", 404);

    Categories.childs.forEach((categories) => categories.remove());

    // delete category
    Categories.remove();

    return res.redirect("/admin/categories/categories");
  } catch (err) {
    next(err);
  }
};
