const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const slugify = require("slugify");
const controller = require("./../controller");
const upload = require("./../../helpers/upload");
const parts = require("./../../models/parts");
const sections = require("./../../models/sections");
const posts = require("./../../models/posts");
const tags = require("./../../models/tags");

function slug(title) {
  return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
}
function getPosts(post) {
  return posts.findById(post).exec()
}
exports.showAll = async (req, res, next) => {
    let page = req.query.page || 1;
    let Sections= await sections.paginate(
      {},
      { page, sort: { createdAt: -1 }, limit: 10 }
    );
    
    
    res.render("admin/sections/sections", {  layout : 'layoutAdmin',Sections ,user: req.user.name } );
  };

exports.createShow = async (req, res, next) => {
  let Posts = await posts.find({});
  let Tags = await tags.find({});
  res.render("admin/sections/createsections", {
    layout: "layoutAdmin",
    Posts,
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
    
    let { title, description, tags , posts , type } = req.body;
    let user = req.user.email
    let sources = description
      .match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      .map((x) => x.replace(/.*src="([^"]*)".*/, "$1"));
    let Posts = await getPosts(req.body.posts)
    let newSection = new sections({
      user,
      title,
      description,
      posts,
      postsName : Posts.title,
      tags,
      type,
      imageSources: sources,
      slug: slug(title),
    });
    
    await newSection.save();
    return res.redirect("/admin/sections");
  } catch (err) {
    next(err);
  }
};
exports.delete = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let Sections = await sections.findById(req.params.id).exec();
  if (!Sections) controller.error("error can not be found", 404);
  //delete parts
  // Object.values(Sections.parts).forEach((part) =>
  // );
  //delete posts
  Sections.remove();
  res.redirect("/admin/sections");
};
exports.editShow = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let Sections = await sections.findById(req.params.id);
  if (!Sections) controller.error("error can not be found", 404);
  let Posts = await posts.find({});
  let Tags = await tags.find({});
  return res.render("admin/sections/editsections", {
    Sections,
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
  return res.redirect("/admin/sections");
};

