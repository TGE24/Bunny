import User from "../models/userModel";
import Appointment from "../models/appointment";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import QRCode from "qrcode";
import { roles } from "../helpers/roles";

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      dob,
      gender,
      address,
      password
    } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      phone,
      dob,
      gender,
      address,
      password: hashedPassword,
      role: "patient"
    });
    const generateQR = async text => {
      try {
        const code = await QRCode.toDataURL(text);
        return code;
      } catch (err) {
        console.error(err);
      }
    };
    const id = newUser._id;

    const code = await generateQR(
      "https://g-proclinic.herokuapp.com/doctor/patient/" + id
    );

    newUser.code = code;

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    newUser.accessToken = accessToken;
    await newUser.save();
    req.session.token = accessToken;
    req.session.user = newUser;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.addAppointment = async (req, res, next) => {
  try {
    const {
      patientId,
      doctorId,
      date,
      time,
      problem,
      department,
      status,
      token
    } = req.body;
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      problem,
      department,
      status,
      token
    });
    await newAppointment.save();
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({});
    if (!appointments) return next(new Error("No Appointment found"));
    res.locals.appointments = appointments;
    const patientNames = [];
    for (let i = 0; i < appointments.length; i++) {
      const patients = await User.findById(appointments[i].patientId);
      patientNames.push(patients.name);
    }
    res.locals.patientNames = patientNames;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getDoctorsAppointments = async (req, res, next) => {
  try {
    const id = { doctorId: req.session.user.name };
    const appointments = await Appointment.find(id);
    if (!appointments) return next(new Error("No Appointment found"));
    res.locals.doctorAppointments = appointments;
    const patientsArray = [];
    for (let i = 0; i < appointments.length; i++) {
      const patients = await User.findById(appointments[i].patientId);
      patientsArray.push(patients.name);
    }
    res.locals.doctorsPatients = patientsArray;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getPatientAppointmentDetail = async (req, res, next) => {
  try {
    const id = { token: req.params.appId };
    const appointments = await Appointment.find(id);
    if (!appointments) return next(new Error("No Appointment found"));
    res.locals.patientAppointment = appointments;
    const patient = await User.findById(appointments[0].patientId);
    res.locals.patientCode = patient.code;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getPatientsAppointments = async (req, res, next) => {
  try {
    const id = { patientId: req.session.user._id };
    const appointments = await Appointment.find(id);
    if (!appointments) return next(new Error("No Appointment found"));
    res.locals.patientAppointments = appointments;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    delete res.locals.loggedInUser;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.addDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      dob,
      phone,
      specialization,
      experience,
      age,
      gender,
      details
    } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      dob,
      phone,
      specialization,
      experience,
      age,
      gender,
      details,
      password: hashedPassword,
      role: "doctor"
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    newUser.accessToken = accessToken;
    await newUser.save();
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Email does not exist"));
    const validPassword = await validatePassword(
      password,
      user.password
    );
    if (!validPassword)
      return next(new Error("Password is not correct"));
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    await User.findByIdAndUpdate(user._id, { accessToken });
    req.session.token = accessToken;
    req.session.user = user;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getDoctors = async (req, res, next) => {
  try {
    const role = { role: "doctor" };
    const users = await User.find(role);
    if (!users) return next(new Error("No doctor found"));
    res.locals.doctors = users;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const role = { role: "patient" };
    const users = await User.find(role);
    if (!users) return next(new Error("No Patient found"));
    res.locals.patients = users;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.locals.patient = user;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getPatientVisits = async (req, res, next) => {
  try {
    const id = { patientId: req.params.id };
    const visits = await Appointment.find(id);
    res.locals.patientVisits = visits;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const id = { token: req.params.appId };
    const { diagnosis, prescription } = req.body;
    const update = {
      diagnosis,
      prescription,
      status: "completed"
    };
    await Appointment.findOneAndUpdate(id, update);
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    const id = { token: req.params.appId };
    console.log(id);
    const update = {
      status: "cancelled"
    };
    await Appointment.findOneAndUpdate(id, update);
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: "User has been updated"
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: "User has been deleted"
    });
  } catch (error) {
    next(error);
  }
};

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error:
            "You don't have enough permission to perform this action"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user) res.redirect("/");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
