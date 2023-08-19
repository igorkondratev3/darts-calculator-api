const express = require("express");
const { setStatistic, getStatistic } = require("../controllers/statistic.js");
const requireAuth = require("../middleware/requireAuth.js");
const router = express.Router();

router.use(requireAuth);
router.post("/", setStatistic);
router.get("/", getStatistic);

module.exports = router;
