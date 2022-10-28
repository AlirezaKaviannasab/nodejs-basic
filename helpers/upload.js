const multer = require("multer");
const mkdirp = require("mkdirp");
const fs = require("fs");

const getDir = () => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let day = new Date().getDay();
  return `./public/storage/${year}/${month}/${day}`;
};
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = getDir();
    mkdirp(dir , (err) => cb(null , dir))
  },
  filename: function (req, file, cb) {
    const filePath = getDir() + "/" + file.originalname;
    if (!fs.existsSync(filePath)) {
        cb(null, file.originalname)
    } else {
      cb(null, file.originalname );
    }
  },
});

const upload = multer({
  storage: Storage,
})
module.exports = upload;