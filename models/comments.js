const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
const commentsSchema = new mongoose.Schema(
  {
    user: {
       type : Schema.Types.ObjectId , ref : 'User',
    },
    parent: { type: Schema.Types.ObjectId, ref: "Comments", default: null },
    body: {
      type: String,
      required : true
    },
    posts : {
      type : Schema.Types.ObjectId,
      ref: 'Posts',
      default : undefined
    },
    parts : {
      type : Schema.Types.ObjectId,
      ref: 'Parts',
      default : undefined
    },
    approved: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    timestamps : true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
commentsSchema.plugin(mongoosePaginate);
commentsSchema.virtual('Comments',{
  ref : 'Comments',
  localField : '_id',
  foreignField : 'parent'
})
commentsSchema.methods.toId = function () {
  return this.parent.toString();
};
const Comments = mongoose.model("Comments", commentsSchema);
module.exports = Comments;
