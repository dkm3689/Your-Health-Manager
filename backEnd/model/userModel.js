const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = mongoose.Schema;
const userSchema = new schema({

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }

});

userSchema.pre('save', async function (next) {
  //only run encryption logic when pass is changed else use previous one
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});


//called at the time of fetching usef details
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;