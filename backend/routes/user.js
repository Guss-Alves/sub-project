const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  CreateCodeUser,
  userById,
  getAllUsers,
  sendCodeToUser,
  confirmCode,
  sendPhoneCode,
  confirmPhoneCode,
  CreateAdminCodeUser,
} = require("../controllers/user");

router.post("/", registerUser);
router.post("/login", loginUser);

router.post("/code", CreateCodeUser);
router.post("/code/admin", CreateAdminCodeUser);

router.get("/:id", userById);
router.get("/info/all", getAllUsers);

router.post("/email/code/:id", sendCodeToUser);
router.post("/email/code/confirm/:id", confirmCode);

router.post("/phone/code/:id", sendPhoneCode);
router.post("/phone/code/confirm/:id", confirmPhoneCode);

module.exports = router;
