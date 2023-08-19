const express = require("express");
const { deleteRefreshToken } = require("../controllers/refreshToken.js");
const router = express.Router();

router.delete("/", deleteRefreshToken);

module.exports = router;
