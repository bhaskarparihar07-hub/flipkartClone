const express = require('express');
const { seedAdmin, seedProducts, checkDB } = require('../controllers/seedController');

const router = express.Router();

router.route('/check-db').get(checkDB);
router.route('/seed-admin').get(seedAdmin);
router.route('/seed-products').get(seedProducts);

module.exports = router;
