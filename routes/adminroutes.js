const express = require("express");
const router = express.Router();
const upload = require("./../helpers/upload");
const gate = require("./../helpers/gate");
//CONTROLLERS
const adminController = require("./../controllers/adminController");
const postsController = require("./../controllers/admin/postsController");
const commentsController = require("./../controllers/admin/commentController");
const authController = require("./../controllers/authController");
const usersController = require("./../controllers/admin/usersController");
const tagsController = require("./../controllers/admin/tagsController");
const partsController = require("./../controllers/admin/partsController");
const sectionsController = require("./../controllers/admin/sectionsController");
const rolesController = require("./../controllers/admin/rolesController");
const categoriesController = require("./../controllers/admin/categoriesController");
const permissionsController = require("./../controllers/admin/permissionsController");
//VALIDATORS
const categoriesValidator = require("./../validators/categoriesValidator");
const partsValidator = require("./../validators/partsValidator");
const tagsValidator = require("./../validators/tagsValidator");
const postsValidator = require("./../validators/postsValidator");
const sectionsValidator = require("./../validators/sectionsValidator");
const permissionsValidator = require("./../validators/permissionsValidator");
const rolesValidator = require("./../validators/rolesValidator");
const usersValidator = require("./../validators/signupValidator");
router.use(authController.protect, gate.can("adminpanel"));
router.get("/", (req, res) => {
  res.render("admin/index", { layout: "layoutAdmin", user: req.user.name });
});
//USERS

router.get("/users", gate.can("admin-usersshow"), usersController.showUsers);
router.get(
  "/users/create",
  gate.can("admin-usersmanage"),
  usersController.createShow
);
router.post(
  "/users/create",
  gate.can("admin-usersmanage"),
  usersValidator.handle(),
  usersController.create
);
router.post(
  "/users/delete/:id",
  gate.can("admin-usersmanage"),
  usersController.destroy
);
router.get(
  "/users/edit/:id",
  gate.can("admin-usersmanage"),
  usersController.editShow
);
router.post(
  "/users/edit/:id",
  gate.can("admin-usersmanage"),
  usersController.update
);
router.get(
  "/users/:id/addroles",
  gate.can("admin-usersmanage"),
  usersController.addRoleShow
);
router.post(
  "/users/:id/addroles",
  gate.can("admin-usersmanage"),
  usersController.addRole
);
//ROLES

router.get(
  "/users/roles",
  gate.can("admin-rolesshow"),
  rolesController.showAll
);
router.get(
  "/users/roles/create",
  gate.can("admin-rolesmanage"),
  rolesController.createShow
);
router.post(
  "/users/roles/create",
  gate.can("admin-rolesmanage"),
  rolesValidator.handle(),
  rolesController.create
);
router.get(
  "/users/roles/:id/edit",
  gate.can("admin-rolesmanage"),
  rolesController.editShow
);
router.post(
  "/users/roles/:id",
  gate.can("admin-rolesmanage"),
  rolesValidator.handle(),
  rolesController.edit
);
router.post(
  "/users/roles/delete/:id",
  gate.can("admin-rolesmanage"),
  rolesController.delete
);
//PERMISSIONS
router.get(
  "/users/permissions",
  gate.can("admin-permissionsshow"),
  permissionsController.showAll
);
router.get(
  "/users/permissions/create",
  gate.can("admin-permissionsmanage"),
  permissionsController.createShow
);
router.post(
  "/users/permissions/create",
  gate.can("admin-permissionsmanage"),
  permissionsValidator.handle(),
  permissionsController.create
);
router.get(
  "/users/permissions/:id/edit",
  gate.can("admin-permissionsmanage"),
  permissionsController.editShow
);
router.post(
  "/users/permissions/:id",
  gate.can("admin-permissionsmanage"),
  permissionsValidator.handle(),
  permissionsController.edit
);
router.post(
  "/users/permissions/delete/:id",
  gate.can("admin-permissionsmanage"),
  permissionsController.delete
);

//POSTS
router.get("/posts", gate.can("admin-postsshow"), postsController.showPosts);

router.get(
  "/posts/create",
  gate.can("admin-postsmanage"),
  postsController.createShow
);
router.post(
  "/image-upload",
  upload.single("upload"),
  postsController.imageUpload
);

router.post(
  "/posts/create",
  gate.can("admin-postsmanage"),
  postsValidator.handle(),
  postsController.create
);

router.get(
  "/posts/:id/edit",
  gate.can("admin-postsmanage"),
  postsController.edit
);
router.post(
  "/posts/:id",
  gate.can("admin-postsmanage"),
  upload.single("upload"),
  postsValidator.handle(),
  postsController.update
);
router.post(
  "/posts/delete/:id",
  gate.can("admin-postsmanage"),
  postsController.destroy
);

//CATEGORIES
router.get(
  "/categories",
  gate.can("admin-categoriessshow"),
  categoriesController.showAll
);
router.get(
  "/categories/create",
  gate.can("admin-categoriesmanage"),
  categoriesController.createShow
);
router.post(
  "/categories/create",
  gate.can("admin-categoriesmanage"),
  categoriesValidator.handle(),
  categoriesController.create
);
router.get(
  "/categories/:id/edit",
  gate.can("admin-categoriesmanage"),
  categoriesController.editShow
);
router.post(
  "/categories/:id",
  gate.can("admin-categoriesmanage"),
  categoriesValidator.handle(),
  categoriesController.edit
);
router.post(
  "/categories/delete/:id",
  gate.can("admin-categoriesmanage"),
  categoriesController.delete
);

//COMMMENTS

router.get(
  "/comments",
  gate.can("admin-commentsshow"),
  commentsController.commentsShow
);
router.get(
  "/comments/approved",
  gate.can("admin-commentsmanage"),
  commentsController.approved
);
router.post(
  "/comments/delete/:id",
  gate.can("admin-commentsmanage"),
  commentsController.destroy
);
router.post(
  "/comments/update/:id",
  gate.can("admin-commentsmanage"),
  commentsController.update
);

//TAGS
router.get("/tags", gate.can("admin-tagssshow"), tagsController.showAll);
router.get(
  "/tags/create",
  gate.can("admin-tagsmanage"),
  tagsController.createShow
);
router.post(
  "/tags/create",
  gate.can("admin-tagsmanage"),
  tagsValidator.handle(),
  tagsController.create
);
router.get(
  "/tags/:id/edit",
  gate.can("admin-tagsmanage"),
  tagsController.editShow
);
router.post(
  "/tags/:id",
  gate.can("admin-tagsmanage"),
  tagsValidator.handle(),
  tagsController.edit
);
router.post(
  "/tags/delete/:id",
  gate.can("admin-tagsmanage"),
  tagsController.delete
);

//PARTS
router.get("/parts", gate.can("admin-partsshow"), partsController.showAll);
router.get(
  "/parts/create",
  gate.can("admin-partsmanage"),
  partsController.createShow
);
router.post(
  "/parts/create",
  gate.can("admin-partsmanage"),
  partsValidator.handle(),
  partsController.create
);
router.get(
  "/parts/create/:id/upload",
  gate.can("admin-partsmanage"),
  partsController.uploadShow
);
router.post(
  "/parts/create/upload",
  gate.can("admin-partsmanage"),
  upload.single("partFile"),
  partsController.upload
);
router.get(
  "/parts/:id/edit",
  gate.can("admin-partsmanage"),
  partsController.editShow
);
router.post(
  "/parts/:id",
  gate.can("admin-partsmanage"),
  partsValidator.handle(),
  upload.single("partFile"),
  partsController.edit
);
router.post(
  "/parts/delete/:id",
  gate.can("admin-partsmanage"),
  partsController.delete
);

//SECTIONS
router.get(
  "/sections",
  gate.can("admin-sectionsshow"),
  sectionsController.showAll
);
router.get(
  "/sections/create",
  gate.can("admin-sectionsmanage"),
  sectionsController.createShow
);
router.post(
  "/sections/create",
  gate.can("admin-sectionsmanage"),
  sectionsValidator.handle(),
  upload.single("upload"),
  sectionsController.create
);
router.get(
  "/sections/:id/edit",
  gate.can("admin-sectionsmanage"),
  sectionsController.editShow
);
router.post(
  "/sections/:id",
  gate.can("admin-sectionsmanage"),
  sectionsValidator.handle(),
  upload.single("upload"),
  sectionsController.edit
);
router.post(
  "/sections/delete/:id",
  gate.can("admin-sectionsmanage"),
  sectionsController.delete
);

router.get(
  "/:postid",
  gate.can("admin-sectionsshow"),
  adminController.showSpecificSection
);
router.get(
  "/:postid/:partid",
  gate.can("admin-partsshow"),
  adminController.showSpecificPart
);

module.exports = router;
