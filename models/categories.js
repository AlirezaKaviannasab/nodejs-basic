const mongoose = require("mongoose");
const Schema = mongoose.Schema
const mongoosePaginate = require("mongoose-paginate");
const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
    },
    parent: { type: Schema.Types.ObjectId, ref: "Categories", default: null },
    description: {
      type: String,
      trim: true,
    },
    // slug: {
    //   type: String,
    // }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
categoriesSchema.plugin(mongoosePaginate);
categoriesSchema.virtual('childs' , {
  ref : 'Categories',
  localField : '_id',
  foreignField : 'parent'
});
const Categories = mongoose.model("Categories", categoriesSchema);
module.exports = Categories;
