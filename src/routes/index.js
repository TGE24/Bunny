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
  userController.getPatients,
  userController.getAppointments,
  userController.getDoctors,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("admin", {
      user: res.locals.loggedInUser,
      patients: res.locals.patients,
      appointments: res.locals.appointments,
      patientName: res.locals.patientNames,
      doctors: res.locals.doctors
    });
  }
);

router.get(
  "/admin/add-doctor",
  userController.allowIfLoggedin,
  userController.getPatients,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("add-doctor", {
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
  "/doctor/appointment/:appId",
  userController.allowIfLoggedin,
  userController.getPatientAppointmentDetail,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("appointmentDetails", {
      user: res.locals.loggedInUser,
      details: res.locals.patientAppointment,
      code: res.locals.patientCode
    });
  }
);

router.get(
  "/patient/:id/appointments/:appId",
  userController.allowIfLoggedin,
  userController.getPatientAppointmentDetail,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("pAppointmentDetails", {
      user: res.locals.loggedInUser,
      details: res.locals.patientAppointment
    });
  }
);

router.post(
  "/updateAppointment/:appId",
  userController.allowIfLoggedin,
  userController.updateAppointment,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.redirect("/doctor/appointments");
  }
);

router.get(
  "/cancelAppointment/:appId",
  userController.allowIfLoggedin,
  userController.cancelAppointment,
  userController.grantAccess("updateAny", "profile"),
  (req, res, next) => {
    res.redirect(
      "/patient/" + res.locals.loggedInUser.id + "/appointments"
    );
  }
);

router.get(
  "/doctor/appointments",
  userController.allowIfLoggedin,
  userController.getPatients,
  userController.getDoctorsAppointments,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("appointments", {
      user: res.locals.loggedInUser,
      patients: res.locals.patients,
      appointments: res.locals.doctorAppointments,
      appointmentPatients: res.locals.doctorsPatients
    });
  }
);

router.get(
  "/admin/add-patient",
  userController.allowIfLoggedin,
  userController.getPatients,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("add-patient", {
      user: res.locals.loggedInUser,
      patients: res.locals.patients
    });
  }
);

router.get(
  "/doctor/patient/:id",
  userController.allowIfLoggedin,
  userController.getUser,
  userController.getPatientVisits,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("patientdetails", {
      user: res.locals.loggedInUser,
      visits: res.locals.patientVisits
    });
  }
);

router.get(
  "/patientdetails/:id",
  userController.getPatientVisits,
  (req, res, next) => {
    res.render("qrview", {
      visits: res.locals.patientVisits
    });
  }
);

router.get(
  "/patient/:id",
  userController.allowIfLoggedin,
  userController.getPatients,
  userController.getPatientVisits,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("patient", {
      user: res.locals.loggedInUser,
      patients: res.locals.patients,
      visits: res.locals.patientVisits
    });
  }
);

router.get(
  "/patient/:id/appointments",
  userController.allowIfLoggedin,
  userController.getPatients,
  userController.getPatientsAppointments,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("patientsAppointment", {
      user: res.locals.loggedInUser,
      patients: res.locals.patients,
      appointments: res.locals.patientAppointments
    });
  }
);

router.get(
  "/patient/:id/add-appointment",
  userController.allowIfLoggedin,
  userController.getPatients,
  userController.getDoctors,
  userController.getAppointments,
  (req, res, next) => {
    res.render("add-appointment", {
      user: res.locals.loggedInUser,
      patients: res.locals.patients,
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
    res.redirect(
      "/patient/" + res.locals.loggedInUser.id + "/appointments"
    );
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
  userController.getPatients,
  userController.signup,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.redirect("/admin/patients");
  }
);

router.post("/login", userController.login, (req, res) => {
  if (req.session.user.role === "patient") {
    res.redirect("/patient/" + req.session.user.id);
  } else if (req.session.user.role === "doctor") {
    res.redirect("/doctor/patients");
  } else {
    res.redirect("/admin");
  }
});

router.get("/logout", userController.logout, (req, res) => {
  res.redirect("/");
});

module.exports = router;
