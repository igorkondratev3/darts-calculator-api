const express = require('express');
const {  
  setStatistic,
  getStatistic
} = require('../controllers/statistic.js');
const requireAuth = require('../middleware/requireAuth.js')
const router = express.Router();

router.use(requireAuth);
router.post('/set', setStatistic);
router.post('/get', getStatistic);//плохо, но так как обновляем токены

module.exports = router; 