const { validationResult } = require("express-validator");
const isMongoId = require("validator/lib/isMongoId");
const bcrypt = require("bcrypt");
exports.validationData = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array();
    const messages = [];
    errors.forEach((err) => messages.push(err.msg));
    req.flash("errors", messages);

    return false;
  }
  return true;
};
exports.back = (req, res) => {
  req.flash("formData", req.body);
  return res.redirect(req.header("Referer") || "/");
};

exports.isMongoId = function (paramId) {
  if (!isMongoId(paramId)) {
    this.error("id is not correct", 404);
  }
};
exports.error = function (messages, status = 500) {
  let err = new Error(messages);
  err.status = status;
  throw err;
};
exports.alert = function (req, data) {
  let title = data.title || "";
  let message = data.message || "";
  let icon = data.type || "info";
  let button = data.button || null;
  let timer = data.timer || 3000;
  req.flash("sweetalert", { title, message, icon, button, timer });
};
exports.checkHash = function (req, part) {
  let text = `A$*OO0563##112feanfkp^+_faskbg${part.id}${req.query.t}`;
  return bcrypt.compareSync(text, req.query.mac);
};
