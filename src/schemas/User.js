const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  pw: String,
  device: String,
});

module.exports = mongoose.model("UserSchema", UserSchema);
