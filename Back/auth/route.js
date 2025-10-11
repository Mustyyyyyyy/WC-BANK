const express = require('express');
const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/me', authMiddleware, getMe);
router.put('/update-profile', authMiddleware, updateProfile);
router.post('/support', authMiddleware, support);

module.exports = router;