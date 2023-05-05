const express = require('express');
const {  
  setStatistic,
} = require('../controllers/statistic.js');
const requireAuth = require('../middleware/requireAuth.js')
const router = express.Router();

router.use(requireAuth);
router.post('/', setStatistic);

module.exports = router; 