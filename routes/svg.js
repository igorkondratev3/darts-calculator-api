const express = require('express');
const { 
  getSvg
} = require('../controllers/svg.js');
const router = express.Router();

router.get('/', getSvg);

module.exports = router; 