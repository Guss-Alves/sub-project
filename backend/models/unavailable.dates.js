const mongoose = require("mongoose");

const unavailableSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    dates: {
      type: [Date],
      required: [true, "date is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Unavailable", unavailableSchema);
