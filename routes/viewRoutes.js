const express = require("express");
const router = express.Router();
const gate = require("./../helpers/gate");
const homeController = require("./../controllers/homecontroller");
const authController = require("./../controllers/authcontroller");
const posts = require("./../models/posts");
const user = require("./../models/users");
const commentValidator = require("./../validators/commentValidator");
const ratingValidator = require("./../validators/ratingValidator");
const purchasingValidator = require("./../validators/purchasingValidator");
const { route } = require("./adminroutes");
router.get("/", async (req, res) => {
  let Posts = await posts.find({}).sort({ createdAt: 1 }).limit(20).exec();
  res.render("home/home", { cookies: req.cookies.token, Posts });
});
router.get(
  "/posts/:posts",
  authController.checkCurrentUser,
  homeController.singleShow
);
router.post(
  "/posts/:posts",
  authController.protect,
  // purchasingValidator.handle(),
  homeController.purchasePost
);
// router.post(
//   "/parts/purchasing",
//   authController.protect,
//   // purchasingValidator.handle(),
//   homeController.purchasing
// );
router.post(
  "/comments",
  authController.protect,
  gate.can("show-savecomments"),
  commentValidator.handle(),
  homeController.createComment
);
router.post(
  "/rating",
  authController.protect,
  gate.can("show-saverates"),
  ratingValidator.handle(),
  homeController.getRates
);

router.get("/posts", homeController.postPagesShow);

router.get(
  "/files/:parts",
  authController.checkCurrentUser,
  homeController.downloading
);

router.get("/sitemap.xml", homeController.siteMap);
router.get("/feed/posts", homeController.postsFeed);
router.get("/feed/parts", homeController.partsFeed);
module.exports = router;
