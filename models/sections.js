const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
const validator = require("validator");
const sectionsSchema = new mongoose.Schema(
  {
    user: String,
    title: {
      type: String,
      required: true,
      minlength: 2,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],
    postsName : String,
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
  },
  {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);
sectionsSchema.plugin(mongoosePaginate);
sectionsSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
sectionsSchema.methods.Path = function () {
  return `/sections/${this.slug}`;
};
sectionsSchema.virtual("Parts", {
  ref: "Parts",
  localField: "_id",
  foreignField: "sections",
});
const Sections = mongoose.model("Sections", sectionsSchema);
module.exports = Sections;
