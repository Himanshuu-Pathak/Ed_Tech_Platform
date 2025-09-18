// const express = require("express");
// const router = express.Router();
// //const { getUserDetails } = require("../controllers/Profile");
// //const { capturePayment, verifyPayment, sendPaymentSuccessEmail,
// //} = require("../controllers/Payments");

// const { auth, isStudent } = require("../middlewares/auth");
// router.get("/getUserDetails", auth, getUserDetails);
// router.post("/capturePayment", auth, isStudent, capturePayment);
// router.post("/verifyPayment", auth, isStudent, verifyPayment);
// router.post("/sendPaymentSuccessEmail",auth,isStudent,sendPaymentSuccessEmail);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth");
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;