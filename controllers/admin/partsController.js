const parts = require("./../../models/parts");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const slugify = require("slugify");
const controller = require("./../controller");
const upload = require("./../../helpers/upload");
const posts = require("./../../models/posts");
const sections = require("./../../models/sections");
const tags = require("./../../models/tags");
// function getUrlImage(dir) {
//   return dir.substring(8);
// }
function slug(title) {
  return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
}

exports.showAll = async (req, res, next) => {
  let page = req.query.page || 1;
  let Parts = await parts.paginate(
    {},
    { page, sort: { createdAt: -1 }, limit: 10 }
  );
  res.render("admin/parts/parts", {
    Parts,
    layout: "layoutAdmin",
    user: req.user.name,
  });
};

exports.createShow = async (req, res, next) => {
  let Sections = await sections.find({});
  let Tags = await tags.find({});
  res.render("admin/parts/createPart", {
    layout: "layoutAdmin",
    Sections,
    Tags,
    user: req.user.name,
  });
};

exports.create = async (req, res, next) => {
  try {
    let status = await controller.validationData(req);
    if (!status) {
      return controller.back(req, res);
    }

    let { title, description, price, tags, sections, type } = req.body;
    let user = req.user.email;
    let sources = description
      .match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      .map((x) => x.replace(/.*src="([^"]*)".*/, "$1"));
    let newPart = new parts({
      user,
      title,
      description,
      price,
      sections,
      tags,
      type,
      links: [],
      imageSources: sources,
      slug: slug(title),
    });

    await newPart.save();
    return res.redirect(`/admin/parts/create/${newPart._id}/upload`);
  } catch (err) {
    next(err);
  }
};
exports.delete = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let Parts = await parts.findById(req.params.id).exec();
  if (!Parts) controller.error("error can not be found", 404);
  //delete images
  Object.values(Parts.links).forEach((image) =>
    fs.unlinkSync(`./public${image}`)
  );
  //delete posts
  Parts.remove();
  res.redirect("/admin/parts");
};
exports.editShow = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let Parts = await parts.findById(req.params.id);
  if (!Parts) controller.error("error can not be found", 404);
  let Posts = await posts.find({});
  let Tags = await tags.find({});
  return res.render("admin/parts/editPart", {
    Parts,
    Posts,
    Tags,
    layout: "layoutAdmin",
    user: req.user.name,
  });
};
exports.edit = async (req, res, next) => {
  let status = await controller.validationData(req);
  if (!status) {
    if (req.file) fs.unlinkSync(req.file.path);
    return controller.back(req, res);
  }
  let objectForUpdate = {};
  objectForUpdate.slug = slug(req.body.title);
  await parts.findByIdAndUpdate(req.params.id, {
    $set: { ...req.body, ...objectForUpdate },
  });
  // redirect back
  return res.redirect("/admin/parts");
};
exports.uploadShow = async (req, res, next) => {
  let partId = req.params.id;
  res.render("admin/parts/createUpload", {
    layout: "layoutAdmin",
    user: req.user.name,
    partId,
  });
};
exports.upload = async (req, res, next) => {
  let link = req.file.path.substring(7)
  await parts.findByIdAndUpdate(req.body.partId, {
    $set: { links: link},
  });
  return res.redirect("/admin/parts");
};
