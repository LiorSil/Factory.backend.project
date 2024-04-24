const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startingHour: {
      type: Number,
      required: true,
    },
    endingHour: {
      type: Number,
      required: true,
    },
    assigned: {
      type: Boolean,
      default: false,
    },
  },
  { toObject: { dateToString: false }, toJSON: { dateToString: false } }
);

const Shift = mongoose.model("Shift", shiftSchema);

module.exports = Shift;
