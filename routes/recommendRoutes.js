const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');

// AI Recommendation APIs
router.post('/personalized', recommendController.recommendPersonalized);
router.post('/category', recommendController.recommendByCategory);
router.get('/trending', recommendController.recommendTrending);
router.post('/related', recommendController.recommendRelated);

module.exports = router;
