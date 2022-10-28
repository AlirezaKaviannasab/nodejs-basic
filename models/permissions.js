const mongoose = require("mongoose");
const Schema = mongoose.Schema
const mongoosePaginate = require("mongoose-paginate");
const permissionsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
    },
    label: {
      type: String,
    }
  },
  {
    timestamps : true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
permissionsSchema.plugin(mongoosePaginate);
permissionsSchema.virtual('roles' , {
  ref : 'Roles',
  localField : '_id',
  foreignField : 'permissions'
});
const Permissions = mongoose.model("Permissions", permissionsSchema);
module.exports = Permissions;
