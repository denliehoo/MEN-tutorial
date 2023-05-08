import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true } // results in additional createdAt and updatedAt fields.
);

userSchema.statics.findByLogin = async function (login) {
  let user = await this.findOne({
    username: login,
  });

  if (!user) {
    user = await this.findOne({ email: login });
  }

  return user;
};

// if a user is delete, cascade delete all the messages made by the user
userSchema.pre("remove", function (next) {
  this.model("Message").deleteMany({ user: this._id }, next);
});

const User = mongoose.model("User", userSchema);

export default User;
