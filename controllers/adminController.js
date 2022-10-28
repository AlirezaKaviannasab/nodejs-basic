 
const controller = require("./controller");
const parts = require("./../models/parts");
const sections = require("./../models/sections");
const posts = require("./../models/posts");
const mongoose = require('mongoose');

exports.showSpecificSection = async (req,res,next)=>{
  let Sections = await sections.find({posts : req.params.id}).exec()
  let postId = req.params.id
  res.render("admin/sections/specificSections", {  layout : 'layoutAdmin',Sections ,user: req.user.name, postId } );
}
exports.showSpecificPart = async (req, res, next) => {
  let partId = req.params.pid
  let Parts = await parts.find({ sections: partId }).exec();
  let postId = req.params.id
  res.render("admin/parts/specificParts", {
    layout: "layoutAdmin",
    Parts,
    user: req.user.name,
    postId
  });
};

