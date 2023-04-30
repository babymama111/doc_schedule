const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4(),
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});
  const User = mongoose.model("User", UserSchema);
  module.exports = User
