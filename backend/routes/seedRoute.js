const express = require('express');
const { seedDatabase } = require('../controllers/seedController');

const router = express.Router();

router.route('/seed').get(seedDatabase);

module.exports = router;
