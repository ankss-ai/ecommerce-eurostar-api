const express = require('express');
const checkoutController = require('../controllers/checkoutController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Only authenticated users can checkout.
router.post('/', authenticate, checkoutController.checkout);

module.exports = router;
