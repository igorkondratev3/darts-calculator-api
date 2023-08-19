const express = require("express");
const {
  signin,
  signup,
  changeUserInformation,
  deleteUser,
} = require("../controllers/user.js");
const requireAuth = require("../middleware/requireAuth.js");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.use(requireAuth);
router.patch("/", changeUserInformation);
router.delete("/", deleteUser);

module.exports = router;
