import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    code: {
      type: String
    },
    role: {
      type: String,
      default: "patient",
      enum: ["patient", "doctor", "admin"]
    },
    accessToken: {
      type: String
    },
    address: {
      type: String,
      trim: true
    },
    dob: {
      type: String,
      trim: true
    },
    specialization: {
      type: String,
      trim: true
    },
    experience: {
      type: String,
      trim: true
    },
    age: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      trim: true
    },
    details: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
