const mongoose = require("mongoose");
const Schema = mongoose.Schema
const mongoosePaginate = require("mongoose-paginate");
const tagsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
    },
    parent: { type: Schema.Types.ObjectId, ref: "Tags", default: null },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
    },
    posts : {
      type : Schema.Types.ObjectId,
      ref : 'Posts'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tagsSchema.plugin(mongoosePaginate);
tagsSchema.virtual('childs' , {
  ref : 'Tags',
  localField : '_id',
  foreignField : 'parent'
});
const Tags = mongoose.model("Tags", tagsSchema);
module.exports = Tags;
