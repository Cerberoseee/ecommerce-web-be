const express = require('express');
const router = express.Router();
const MarketingTrends = require('../models/marketingTrendsModel');
const { protect, checkPasswordReset, checkLocked } = require('../middlewares/auth');

  /**
 * @swagger
 * /api/marketing-trends:
 *   get:
 *     summary: Get marketing trends data
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days of data to retrieve
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           default: ''
 *         description: Category name to filter trends
 *     responses:
 *       200:
 *         description: Successfully retrieved marketing trends
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const category = req.query.category ? req.query.category : undefined;

        const trends = await MarketingTrends.find({
            timestamp: { $gte: startDate },
            name: category
        })
        .sort({ timestamp: -1 })
        .limit(100);

        res.json({
            success: true,
            data: trends
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching marketing trends',
            error: error.message
        });
    }
});

router.get('/keywords', async (req, res) => {
    try {
        const keywords = req.query.keywords ? req.query.keywords.split(',') : [];
        
        const trends = await MarketingTrends.aggregate([
            {
                $match: keywords.length > 0 ? { keyword: { $in: keywords } } : {}
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: '$keyword',
                    latestTrend: { $first: '$$ROOT' }
                }
            },
            {
                $replaceRoot: { newRoot: '$latestTrend' }
            }
        ]);

        res.json({
            success: true,
            data: trends
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching keyword trends',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/marketing-trends/trends:
 *   get:
 *     summary: Get market trends for a specific category
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID to get trends for
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Optional region for filtering market trends
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *         description: Optional timeframe for trends (e.g., 'weekly', 'monthly', 'quarterly')
 *     responses:
 *       200:
 *         description: Successfully retrieved market trends
 *       400:
 *         description: Missing category ID
 *       500:
 *         description: Server error
 */
router.get('/trends', protect, checkPasswordReset, checkLocked, async (req, res) => {
    try {
        const { categoryId, region = 'VN', timeframe = 'monthly' } = req.query;
        
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
        }
        
        // Simulate market trends data based on the category
        // In a real implementation, this would fetch from a database or external API
        const trendData = generateTrendData(categoryId, region, timeframe);
        
        res.json({
            success: true,
            trends: trendData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching market trends',
            error: error.message
        });
    }
});

// Helper function to generate trend data for the market/trends endpoint
function generateTrendData(categoryId, region, timeframe) {
    // Sample trend keywords for different categories
    const trendKeywords = {
        'smartphone': ['iphone 15', 'samsung galaxy', 'xiaomi', 'oppo find', 'vivo'],
        'tablet': ['ipad pro', 'samsung tab', 'lenovo tab', 'xiaomi pad', 'android tablet'],
        'accessories': ['wireless earbuds', 'phone case', 'screen protector', 'power bank', 'charger'],
        'watch': ['apple watch', 'samsung galaxy watch', 'garmin', 'huawei watch', 'fitness tracker']
    };
    
    // Determine category prefix
    const categoryPrefix = categoryId.split('-')[0] || 'smartphone';
    const keywords = trendKeywords[categoryPrefix] || trendKeywords['smartphone'];
    
    // Generate random trend data for each keyword
    return keywords.map((keyword, index) => {
        const baseVolume = 5000 + Math.floor(Math.random() * 15000);
        const growthRate = -20 + Math.floor(Math.random() * 40); // -20% to +20%
        
        // Calculate timestamp based on timeframe
        const now = new Date();
        let timestamp;
        
        switch(timeframe) {
            case 'weekly':
                timestamp = new Date(now.setDate(now.getDate() - (index * 7)));
                break;
            case 'quarterly':
                timestamp = new Date(now.setMonth(now.getMonth() - (index * 3)));
                break;
            case 'monthly':
            default:
                timestamp = new Date(now.setMonth(now.getMonth() - index));
                break;
        }
        
        return {
            keyword,
            region,
            searchVolume: baseVolume,
            growthRate: growthRate,
            timestamp: timestamp.toISOString(),
            competitionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            relatedQueries: generateRelatedQueries(keyword, 3)
        };
    });
}

// Helper function to generate related queries
function generateRelatedQueries(keyword, count) {
    const queries = [
        'best ' + keyword,
        keyword + ' price',
        keyword + ' review',
        'cheap ' + keyword,
        keyword + ' vs',
        'new ' + keyword,
        keyword + ' deals'
    ];
    
    // Shuffle and return the specified count
    return queries
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
}

module.exports = router; 