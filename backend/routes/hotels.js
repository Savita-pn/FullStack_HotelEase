const express = require('express');
const { getHotels, getManagerHotels, getHotel, createHotel, updateHotel, deleteHotel } = require('../controllers/hotelController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getHotels);
router.get('/:id', getHotel);

// Protected routes
router.get('/manager/my-hotels', auth, getManagerHotels);
router.post('/', auth, createHotel);
router.put('/:id', auth, updateHotel);
router.delete('/:id', auth, deleteHotel);

module.exports = router;