const multer = require("multer");
exports.convertFileToField = function (req, res, next) {
  if (!req.files) {
    req.body.images = undefined;
  } else {
    req.body.images = req.files.images;
  }
  next();
};
