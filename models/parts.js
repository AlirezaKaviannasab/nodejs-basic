const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
const validator = require("validator");
const { array } = require("../helpers/upload");
const bcrypt = require('bcrypt')
const partsSchema = new mongoose.Schema(
  {
    user: String,
    title: {
      type: String,
      required: true,
      minlength: 2,
    },
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sections",
      },
    ],
    rating: {
      type: Array,
    },
    price: {
      type: Number,
    },
    // priceDiscount: {
    //   type: Number,
    //   validate: {
    //     validator: function (val) {
    //       return val < this.price;
    //     },
    //     message: "price discount is invalid",
    //   },
    // },
    description: {
      type: String,
    },
    type : {
        type : String,
        enum : ['paid','free','vip'],
        required : true
    },
    imageSources: Array,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    slug: {
      type: String,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    links : {
        type : Array,
        required : true,
    },
  },
  {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);
partsSchema.plugin(mongoosePaginate);
partsSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
partsSchema.methods.Path = function () {
  return `/parts/${this.slug}`;
};
partsSchema.virtual("Comments", {
  ref: "Comments",
  localField: "_id",
  foreignField: "parts",
});
partsSchema.methods.download = function(){
  //for 10 min
  let timeStamps = new Date().getTime() + 1000 * 60 * 10
  let text = `A$*OO0563##112feanfkp^+_faskbg${this.id}${timeStamps}`
  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(text , salt)
  return `${this.id}?mac=${hash}&t=${timeStamps} `
}
const Parts = mongoose.model("Parts", partsSchema);
module.exports = Parts;
