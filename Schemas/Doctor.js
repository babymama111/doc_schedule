const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const DoctorSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4(),
  },
  name: {
    type: String,
    required: true,
  },
  spec: {
    type: String,
    required: true,
  },
  slots: [String],
});

  const Doctor = mongoose.model("Doctor", DoctorSchema);
  module.exports = Doctor
