const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
const validator = require("validator");
const postsSchema = new mongoose.Schema(
  {
    user: String,
    title: {
      type: String,
      required: true,
      minlength: 2,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Categories",
      },
    ],
    rating: {
      type: Array,
    },
    type : {
      type : String,
      enum : ['paid','free','vip'],
      required : true
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
postsSchema.plugin(mongoosePaginate);
postsSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
// postsSchema.methods.priceFilter = function () {
//   switch (this.price) {
//     case "OVER50000":
//       if (this.price > 50000) return this.price;
//       break;
//     case "BELOW50000":
//       if (this.price <= 50000) return this.price;
//       break;
//     default:
//       return "FREE";
//       break;
//   }
// };
postsSchema.methods.Path = function () {
  return `/posts/${this.slug}`;
};
postsSchema.virtual("Comments", {
  ref: "Comments",
  localField: "_id",
  foreignField: "posts",
});
const Posts = mongoose.model("posts", postsSchema);
module.exports = Posts;
