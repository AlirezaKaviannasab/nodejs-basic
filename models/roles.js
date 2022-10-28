const mongoose = require("mongoose");
const Schema = mongoose.Schema
const mongoosePaginate = require("mongoose-paginate");
const rolesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
    },
    label: {
      type: String,
    },
    permissions:[{
      type : Schema.Types.ObjectId,
      ref : 'Permissions'
    }]
  },
  {
    timestamps : true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
rolesSchema.plugin(mongoosePaginate);
const Roles = mongoose.model("Roles", rolesSchema);
module.exports = Roles;
