import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema(
  {
    patientId: {
      type: String,
      required: true,
      trim: true
    },
    doctorId: {
      type: String,
      trim: true
    },
    date: {
      type: String,
      trim: true
    },
    time: {
      type: String,
      trim: true
    },
    problem: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      trim: true,
      default: "pending"
    },
    token: {
      type: String,
      trim: true
    },
    diagnosis: {
      type: String,
      trim: true
    },
    prescription: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model("appointment", AppointmentSchema);

module.exports = Appointment;
