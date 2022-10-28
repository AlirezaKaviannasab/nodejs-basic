const posts = require("./../../models/posts");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const slugify = require("slugify");
const controller = require("./../controller");
const upload = require("./../../helpers/upload");
const categories = require("./../../models/categories");
const tags = require("./../../models/tags");
const parts = require("./../../models/parts");
const sections = require("./../../models/sections");
// function getUrlImage(dir) {
//   return dir.substring(8);
// }
function slug(title) {
  return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
}
// function imageResize(image) {
//   const imageInfo = path.parse(image.path);
//   let imageAddress = {};
//   imageAddress["original"] = getUrlImage(
//     `${image.destination}/${image.filename}`
//   );
//   const resize = (size) => {
//     let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
//     imageAddress[size] = getUrlImage(`${image.destination}/${imageName}`);
//     sharp(image.path)
//       .resize(null, size)
//       .toFile(`${image.destination}/${imageName}`);
//   };
//   [480].map(resize);
//   return imageAddress;
// }
exports.showPosts = async (req, res, next) => {
  let page = req.query.page || 1;
  
  let Posts= await posts.paginate(
    {},
    { page, sort: { createdAt: -1 }, limit: 10 }
  );
  if(! req.userCan('show-posts')){
    controller.error('you do not have permission',403)
  }
  let Sections = await sections.find()
  res.render("admin/posts/posts", { Sections, Posts, layout : 'layoutAdmin' ,user: req.user.name } );
};
exports.createShow = async (req, res, next) => {
  let Categories = await categories.find({});
  let Tags = await tags.find({});
  res.render("admin/posts/createPost", {
    layout: "layoutAdmin",
    Categories,
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
    // let images = imageResize(req.files.images[0]);

    let { title, description, price, tags , categories, type } = req.body;
    let user = req.user.email;
    let sources = description
      .match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      .map((x) => x.replace(/.*src="([^"]*)".*/, "$1"));
    let newPost = new posts({
      user,
      title,
      description,
      price,
      categories,
      tags, 
      type,
      imageSources: sources,
      slug: slug(title),
    });
    
    await newPost.save();
    return res.redirect("/admin/posts");
  } catch (err) {
    next(err);
  }
};
exports.destroy = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let Posts = await posts.findById(req.params.id);
  if (!Posts) controller.error("Posts can not be found", 404);
  let Sections = await sections.find({posts : req.params.id}).exec()
  let Parts ={}
  for(let i = 0; i < Sections.length; i++){
    Parts = await parts.find({sections : req.body.sectionId[i]})
  }
  // let sectionPart = await parts.find({ sections : })
  // let Parts = await parts.find({sections : req.body.sectionId})
  // for (let i = 0; i < Sections.length; i++){
  //   let x = await parts[i].find({sections : sections.id})
  // }
  //delete images
  if(Parts){
    Object.values(Parts.imageSources).forEach((image) =>
    fs.unlinkSync(`./public${image}`)
  );
  Parts.remove();
  }
  if(Sections){
    Object.values(Sections.imageSources).forEach((image) =>
    fs.unlinkSync(`./public${image}`)
  );
  Sections.remove();
  }
  Object.values(Posts.imageSources).forEach((image) =>
    fs.unlinkSync(`./public${image}`)
  );
  //delete posts
  Posts.remove();
  res.redirect("/admin/posts");
};
exports.edit = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let Posts = await posts.findById(req.params.id);
  if (!Posts) controller.error("error can not be found", 404);
  let Categories = await categories.find({});
  let Tags = await tags.find({});
  return res.render("admin/posts/editPost", {
    Posts,
    Categories,
    Tags,
    layout: "layoutAdmin",
    user: req.user.name,
  });
};
exports.update = async (req, res, next) => {
  let status = await controller.validationData(req);
  if (!status) {
    if (req.file) fs.unlinkSync(req.file.path);
    return controller.back(req, res);
  }
  let objectForUpdate = {};
  objectForUpdate.slug = slug(req.body.title);
  await posts.findByIdAndUpdate(req.params.id, {
    $set: { ...req.body, ...objectForUpdate },
  });
  // redirect back
  return res.redirect("/admin/posts");
};
exports.imageUpload = (req, res, next) => {
  image = req.file;
  res.json({
    uploaded: 1,
    filename: image.originalname,
    url: `${image.destination}/${image.filename}`.substring(8),
  });
};
