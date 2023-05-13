const express = require('express');
const router = express.Router();
const userRoutes = require('./user.js');
const refreshTokenRoutes = require('./refreshToken.js');
const statisticRoutes = require('./statistic.js');
const svgRoutes = require('./svg.js');

router.use('/svg', svgRoutes)
router.use('/user', userRoutes);
router.use('/refreshToken', refreshTokenRoutes);
router.use('/statistic', statisticRoutes)

module.exports = router;