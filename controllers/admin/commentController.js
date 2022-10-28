const controller = require("./../controller");
const comments = require("./../../models/comments");
const { trusted } = require("mongoose");

function slug(title) {
  return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
}

exports.commentsShow = async (req, res, next) => {
  let page = req.query.page || 1;
  let Comments = await comments.paginate(
    { approved: true },
    {
      page,
      sort: { createdAt: -1 },
      limit: 20,
      populate: [
        {
          path: "user",
          select: "name",
        },
        {
          path: "posts",
          select: "title",
          model : "posts"
        },
        
      ],
    }
  );
  res.render("admin/comments/comments", {
    layout: "layoutAdmin",
    user: req.user.name,
    Comments,
  });
};

exports.approved = async (req, res, next) => {
  let page = req.query.page || 1;
  let Comments = await comments.paginate({ approved : false } , { page , sort : { createdAt : -1 } , limit : 20 ,
      populate : [
          {
              path : 'user',
              select : 'name'
          },
          {
            path: "posts",
            select: "title",
            model : "posts"
          }
      ]
  });

  res.render("admin/comments/commentsApproved", {
    layout: "layoutAdmin",
    user: req.user.name,
    Comments,
  });
};

exports.destroy = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let Comments = await comments.findById(req.params.id).exec();
  if (!Comments) controller.error("comment can not be found", 404);
  //delete posts
  Comments.remove();
  return controller.back(req, res);

};

exports.update = async (req, res, next) => {
  controller.isMongoId(req.params.id);
  let Comments = await comments.findById(req.params.id).exec();
  if (!Comments) controller.error("comment can not be found", 404);
  Comments.approved = true;
  await Comments.save();
  res.redirect("/admin/comments/comments");
};
