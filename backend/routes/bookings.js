const express = require('express');
const { createBooking, getCustomerBookings, getManagerBookings, updateBookingStatus } = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createBooking);
router.get('/customer', auth, getCustomerBookings);
router.get('/manager', auth, getManagerBookings);
router.put('/:id/status', auth, updateBookingStatus);

module.exports = router;