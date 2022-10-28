const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [3, "name must be more than 3 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "vip", "admin"],
      default: "user",
    },

    password: {
      type: String,
      required: true,
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        //ONLY WORK ON SAVE !!!!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "passwords are not the same",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpire: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    avatar: {
      type: String,
    },
    posts : {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
    parts : {
      type: Schema.Types.ObjectId,
      ref: "Parts",
    },
    roles : {
      type: Schema.Types.ObjectId,
      ref: "Roles",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);
userSchema.plugin(mongoosePaginate)
//HASHING PASSWORD
userSchema.pre("save", async function (next) {
  // ONLY RUNS IF PASSWORD WAS MODIFIED
  if (!this.isModified("password")) {
    return next();
  }
  // HASHING PASSWORD
  this.password = await bcrypt.hash(this.password, 12);
  // DELETE PASSWORD CONFIRM
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  //this point to current middleware
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compareSync(candidatePassword, userPassword);
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpire = Date.now + 10 * 60 * 1000;
  return resetToken;
};
userSchema.methods.hasRole = function (roles) {
  let result = roles.filter(role => {
    return roles.indexOf(role) > -1
  }) 
  return !! result.length
};
const User = mongoose.model("User", userSchema);
module.exports = User;
