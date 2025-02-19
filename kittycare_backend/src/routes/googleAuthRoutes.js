const express = require('express');
const router = express.Router();
const googleAuthController = require('../controllers/googleAuthController');

router.post('/google', googleAuthController.googleAuthHandler);

module.exports = router;
