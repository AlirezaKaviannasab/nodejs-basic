const { redirect } = require("express/lib/response");
const passport = require("passport");
const controller = require("./controller");
const posts = require("./../models/posts");
const comments = require("./../models/comments");
const categories = require("./../models/categories");
const user = require("./../models/users");
const parts = require("./../models/parts");
const sections = require("./../models/sections");
const path = require('path')
const fs = require('fs')
const swal = require("sweetalert2");
const rss = require('rss')
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')
const { Readable } = require('stream')
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.isLogged = true;
    return next();
  }
  controller.alert(req, {
    title: "You are not LoggedIn ",
    type: "error",
    timer: "4000",
  });
  res.redirect("/");
};
exports.singleShow = async (req, res, next) => {
  const Posts = await posts.findOne({ slug: req.params.posts }).populate([
    {
      path: "Comments",
      match: {
        parent: null,
        approved: true,
      },
      populate: [
        {
          path: "user",
          select: "name",
        },
        {
          path: "Comments",
          match: {
            approved: true,
          },
          populate: {
            path: "user",
            select: "name",
          },
        },
      ],
    },
  ]);

  let Categories = await posts.findOne({ slug: req.params.posts }).populate([
    {
      path: "categories",
      select: "name",
    },
  ]);
  let userRole = {};
  if (res.locals.user == null) {
    userRole = "notLoggedIn";
  } else {
    userRole = res.locals.user.role;
  }
  let userPost = await user.find({
     _id : res.locals.user.id,
    posts: { $in : Posts._id  },
  });
  let User = true;
  if(userPost.length == 0){
    User = false
  }
  let Sections = await sections.find({posts : Posts.id}).exec()
  let sectionId = []
  let Parts =[]
  Sections.forEach(sec=>{
      sectionId.push(sec.id)
  })
  for( let i = 0 ; i < sectionId.length ; i++){
    Parts = await parts.find({ sections : sectionId[i]})
  }
  res.render("home/singlepost", {
    Posts,
    Parts,
    Sections,
    Categories,
    cookies: req.cookies.token,
    userRole,
    User,
    userPost
  });
};
exports.postPagesShow = async (req, res, next) => {
  let query = {};
  if (req.query.search) query.title = new RegExp(req.query.search, "gi");
  // if (req.query.search){
  //   // let Posts = await posts.find({ $or : [{ title : new RegExp(req.query.search, 'gi')} , { description : new RegExp(req.query.search, 'gi')}] });
  //   query.title = new RegExp(req.query.search, "gi");
  //   query.description = new RegExp(req.query.search, "gi");
  // }
  let Posts = posts.find({ ...query });
  if (req.query.order) Posts.sort({ createdAt: -1 });

  if (req.query.price) Posts.sort({ price: 1 });

  Posts = await Posts.exec();
  res.render("home/postspage", { Posts, cookies: req.cookies.token });
};
exports.createComment = async (req, res) => {
  try {
    let status = await controller.validationData(req);
    if (!status) {
      return controller.back(req, res);
    }
    let newComments = new comments({
      user: req.user.id,
      ...req.body,
    });

    await newComments.save();
    controller.alert(req, {
      title: "Your comment has been stored ",
      type: "success",
      timer: "4000",
    });
    return controller.back(req, res);
  } catch (err) {
    console.log(err);
  }
};
exports.getRates = async (req, res, next) => {
  let post = await posts.findById(req.body.postId);
  let user = await posts.findById(req.body.postId, {
    rating: { $elemMatch: { [1]: req.user._id } },
  });
  
  // let user = await posts.find({
  //   rating: { $elemMatch: { [1]: req.user._id }},
  // }); 
  //THE COMMENTED CODE WILL SEARCH IN ALL OF THE POSTS
  if (req.body.rating == null) {
    controller.alert(req, {
      title: "Rate Is Not Valid ",
      type: "error",
      timer: "4000",
    });
  } else {
    if (user.rating.length < 1) {
      const update = { $push: { rating: [req.body.rating, req.user._id] } };
      await post.updateOne(update);
    } else {
      controller.alert(req, {
        title: "This user has been rated ",
        type: "error",
        timer: "4000",
      });
    }
  }
  return controller.back(req, res);
};
exports.downloading = async (req,res,next)=>{
  try{
    controller.isMongoId(req.params.parts)
    let Parts = await parts.findById(req.params.parts)
    if(!Parts) controller.error('فایل یافت نشد',404)

    if(!controller.checkHash(req, Parts)){
      controller.error('link has no credit' , 403)
    }


    let filePath = path.resolve(`./public/${Parts.links}`)
    if(!fs.existsSync(filePath)){
      controller.error('فایل یافت نشد',404)
    }


    return res.download(filePath)
  }catch(err){
    next(err)
  }
} 
exports.purchasePart = async (req,res,next)=>{
  let Parts = await parts.findOne({ slug: req.params.parts })
  let currentUser = res.locals.user
  let Users = await user.findById(currentUser.id)
  if(Parts.type == 'paid'){
    if(currentUser.role == 'admin'){
      const update = { $push: { parts: [Parts.id] } };
      await Users.updateOne(update);
      return res.json('DONE')
    }
    else{
      controller.alert(req, {
      title: "You must buy it first ",
      type: "error", 
      timer: "4000",
    });
    controller.back(req,res)
  }
}
  else if(Parts.type == 'vip'){
    if(currentUser.role == 'vip'){
      const update = { $push: { parts: [Parts.id] } };
      await Users.updateOne(update);
      res.json('DONE')
      next()
    }
    controller.alert(req, {
      title: "You have to be vip",
      type: "error", 
      timer: "4000",
    });
    controller.back(req,res)
  }
  else if(Parts.type == 'free'){
      const update = { $push: { parts: [Parts.id] } };
      await Users.updateOne(update);
      res.json('DONE')
    
    // controller.alert(req, {
    //   title: "You have to be vip",
    //   type: "error", 
    //   timer: "4000",
    // });
    // controller.back(req,res)
  }
}
exports.purchasePost = async (req,res,next)=>{
  let Posts = await posts.findOne({ slug: req.params.posts })
  // return res.json(Posts)
  let currentUser = res.locals.user
  let Users = await user.findById(currentUser.id)
  if(Posts.type == 'paid'){
    if(currentUser.role == 'admin'){
      const update = { $push: { posts: [Posts.id] } };
      await Users.updateOne(update);
      return res.json('DONE')
    }
    else{
      controller.alert(req, {
      title: "You must buy it first ",
      type: "error", 
      timer: "4000",
    });
    controller.back(req,res)
  }
} else if(Posts.type == 'vip'){
    if(currentUser.role == 'vip' || currentUser.role == 'admin'){
      const update = { $push: { posts: [Posts.id] } };
      await Users.updateOne(update);
      res.json('DONE')
      next()
    }
    controller.alert(req, {
      title: "You have to be vip",
      type: "error", 
      timer: "4000",
    });
    controller.back(req,res)
  }
  else if(Posts.type == 'free'){
      const update = { $push: { posts: [Posts.id] } };
      await Users.updateOne(update);
      res.json('DONE')
    
    // controller.alert(req, {
    //   title: "You have to be vip",
    //   type: "error", 
    //   timer: "4000",
    // });
    // controller.back(req,res)
  }
}
exports.siteMap = async (req,res,next) =>{
  try{
    const smStream = new SitemapStream({ hostname: process.env.website_url })
    const pipeline = smStream.pipe(createGzip())
    smStream.write({ url: '/',  changefreq: 'daily', priority: 1 })
    const Posts = await posts.find({}).sort({createdAt : -1 }).exec()
    Posts.forEach(post =>{
      smStream.write({ url: post.Path() ,  changefreq: 'weekly', priority: 0.8 })
    })
    const Parts = await parts.find({}).sort({createdAt : -1 }).exec()
    Parts.forEach(part =>{
      smStream.write({ url: part.Path() ,  changefreq: 'weekly', priority: 0.6 })
    })
    streamToPromise(pipeline).then(sm => sitemap = sm)
    smStream.end()
    pipeline.pipe(res).on('error', (e) => {throw e})
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
  }catch(err){
    next(err)
  }
}
exports.postsFeed = async (req,res,next) =>{
  try{
    let feed = new rss({
      title : 'rss reader',
      description : 'best',
      feed_url : `${process.env.website_url}/feed/posts`,
      site_url : process.env.website_url
    })
    const Posts = await posts.find({}).populate('user').sort({createdAt : -1 }).exec()
    Posts.forEach(post =>{
      feed.item({ title: post.title , description: post.description.substr(0,100) , date: post.createdAt ,url : post.Path() , author : post.user.name})
    })
    res.header('Content-Type', 'application/xml');
    res.send(feed.xml())
  }catch(err){
    next(err)
  }
}
exports.partsFeed = async (req,res,next) =>{
  try{
    
    let feed = new rss({
      title : 'rss reader',
      description : 'best',
      feed_url : `${process.env.website_url}/feed/posts`,
      site_url : process.env.website_url
    })
    const Parts = await parts.find({}).populate({path : 'posts' , populate : 'user'}).sort({createdAt : -1 }).exec()
    Parts.forEach(part =>{
      feed.item({ title: part.title , description: part.description , date: part.createdAt ,url : part.Path() , author : part.user.name})
    })
    res.send(feed.xml())
  }catch(err){
    next(err)
  }
}