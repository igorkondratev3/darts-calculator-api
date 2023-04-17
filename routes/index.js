const express = require('express');
const router = express.Router();
const userRoutes = require('./user.js');
const refreshTokenRoutes = require('./refreshToken.js');

router.use('/user', userRoutes);
router.use('/refreshToken', refreshTokenRoutes);

module.exports = router;