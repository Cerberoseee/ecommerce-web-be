const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');

router.post('/personalized', recommendController.recommendPersonalized);
router.get('/trending', recommendController.recommendTrending);
router.post('/related', recommendController.recommendRelated);

module.exports = router;
