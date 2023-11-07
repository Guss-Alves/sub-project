const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name"],
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
    },
    code: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    paidBalance: {
      type: Array,
      default: [],
    },
    unpaidBalance: {
      type: Array,
      default: [],
    },
    hasSchedule: {
      type: Boolean,
      default: false,
    },
    isCheckIn: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
