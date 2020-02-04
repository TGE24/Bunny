import express from "express";
const router = express.Router();
import userController from "../controllers/userController";

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.get(
  "/admin",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("admin", { user: res.locals.loggedInUser });
  }
);

router.get(
  "/admin/add-doctor",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("add-doctor", { user: res.locals.loggedInUser });
  }
);

router.get(
  "/doctor",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("doctor", { user: res.locals.loggedInUser });
  }
);

router.get(
  "/admin/doctors",
  userController.allowIfLoggedin,
  userController.getDoctors,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("doctors", {
      user: res.locals.loggedInUser,
      doctors: res.locals.doctors
    });
  }
);

router.get(
  "/admin/patients",
  userController.allowIfLoggedin,
  userController.getPatients,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("adminpatients", {
      user: res.locals.loggedInUser,
      patients: res.locals.patients
    });
  }
);

router.get(
  "/doctor/patients",
  userController.allowIfLoggedin,
  userController.getPatients,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("patients", {
      user: res.locals.loggedInUser,
      patients: res.locals.patients
    });
  }
);

router.get(
  "/doctor/appointments",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("appointments", {
      user: res.locals.loggedInUser
    });
  }
);

router.get(
  "/admin/add-patient",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("add-patient", {
      user: res.locals.loggedInUser
    });
  }
);

router.get(
  "/doctor/patient/:id",
  userController.allowIfLoggedin,
  userController.getUser,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("patientdetails", {
      user: res.locals.loggedInUser,
      patient: res.locals.patient
    });
  }
);

router.get(
  "/patient",
  userController.allowIfLoggedin,
  (req, res, next) => {
    res.render("patient", {
      user: res.locals.loggedInUser
    });
  }
);

router.get(
  "/patient/add-appointment",
  userController.allowIfLoggedin,
  userController.getDoctors,
  userController.getAppointments,
  (req, res, next) => {
    res.render("add-appointment", {
      user: res.locals.loggedInUser,
      doctors: res.locals.doctors,
      appointments: res.locals.appointments
    });
  }
);

router.post(
  "/add-appointment",
  userController.allowIfLoggedin,
  userController.addAppointment,
  (req, res, next) => {
    res.redirect("/patient/add-appointment");
  }
);

router.post(
  "/add-doctor",
  userController.allowIfLoggedin,
  userController.addDoctor,
  (req, res, next) => {
    res.redirect("/admin/doctors");
  }
);

// Sign Up Page
router.get("/signup", function(req, res, next) {
  res.render("signup");
});

router.post("/signup", userController.signup, (req, res, next) => {
  res.redirect("/");
});

router.post(
  "/addPatient",
  userController.allowIfLoggedin,
  userController.signup,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.redirect("/admin/patients");
  }
);

router.post("/login", userController.login, (req, res) => {
  if (req.session.user.role === "patient") {
    res.redirect("/patient");
  } else if (req.session.user.role === "doctor") {
    res.redirect("/doctor");
  } else {
    res.redirect("/admin");
  }
});

// router.get(
//   "/user/:userId",
//   userController.allowIfLoggedin,
//   userController.getUser
// );

// router.get(
//   "/users",
//   userController.allowIfLoggedin,
//   userController.grantAccess("readAny", "profile"),
//   userController.getUsers
// );

// router.put(
//   "/user/:userId",
//   userController.allowIfLoggedin,
//   userController.grantAccess("updateAny", "profile"),
//   userController.updateUser
// );

// router.delete(
//   "/user/:userId",
//   userController.allowIfLoggedin,
//   userController.grantAccess("deleteAny", "profile"),
//   userController.deleteUser
// );

module.exports = router;
