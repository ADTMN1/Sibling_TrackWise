const express = require('express');
const router = express.Router();
const userRoutes = require('./routes/UserRoutes.js');
const questionRoutes = require('./routes/questionRoutes');

router.use('/user', userRoutes)
router.use('/question', questionRoutes);

module.exports = router;