// profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('./profileController');

router.post('/profiles', profileController.createProfile);
router.get('/profiles/:id', profileController.getProfile);
router.put('/profiles/:id', profileController.updateProfile);
router.delete('/profiles/:id', profileController.deleteProfile);

module.exports = router;

// In your main app.js, wire this in with:
//   const profileRoutes = require('./profileRoutes');
//   app.use('/api', profileRoutes);
