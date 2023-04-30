const { v4: uuidv4 } = require('uuid');


const mongoose = require("mongoose");
const SlotSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4(),
  },
  user_id: {
    type: String,
    ref: 'User',
  },
  doctor_id: {
    type: String,
    ref: 'Doctor',
  },
  slot: {
    type: String,
    unique: true,
    
  },
});
const Slot = mongoose.model("Slot", SlotSchema);
module.exports = Slot;
