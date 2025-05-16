const cron = require('node-cron');
const googleTrends = require('google-trends-api');
const MarketingTrends = require('../models/marketingTrendsModel');

// Keywords related to phones and accessories
const KEYWORDS = [
    'điện thoại thông minh',
    'ốp lưng điện thoại',
    'tai nghe bluetooth',
    'sạc dự phòng',
    'kính cường lực điện thoại',
    'giá đỡ điện thoại',
    'tai nghe không dây',
    'phụ kiện điện thoại'
];

async function fetchTrendsData(keyword) {
    try {
        const result = await googleTrends.interestOverTime({
            keyword: keyword,
            geo: 'VN',
            timezone: 420, // UTC+7 for Vietnam
            startTime: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)) // Last 7 days
        });

        const data = JSON.parse(result);
        const timelineData = data.default.timelineData;

        // Calculate average search volume
        const searchVolume = timelineData.reduce((acc, item) => acc + parseInt(item.value[0]), 0) / timelineData.length;

        // Get related queries
        const relatedQueriesResult = await googleTrends.relatedQueries({
            keyword: keyword,
            geo: 'VN'
        });
        const relatedData = JSON.parse(relatedQueriesResult);
        const relatedQueries = relatedData.default.rankedList[0].rankedKeyword
            .slice(0, 5)
            .map(item => ({
                query: item.query,
                score: item.value
            }));

        return {
            keyword,
            searchVolume,
            relatedQueries
        };
    } catch (error) {
        console.error(`Error fetching trends for ${keyword}:`, error);
        return null;
    }
}

async function updateMarketingTrends() {
    console.log('Starting marketing trends update...');
    
    for (const keyword of KEYWORDS) {
        try {
            const trendsData = await fetchTrendsData(keyword);
            
            if (trendsData) {
                await MarketingTrends.create(trendsData);
                console.log(`Successfully updated trends for: ${keyword}`);
            }
        } catch (error) {
            console.error(`Failed to update trends for ${keyword}:`, error);
        }
    }
    
    console.log('Marketing trends update completed');
}

// Format: '0 */12 * * *' means "At minute 0 past every 12th hour"
const scheduleTrendsUpdate = () => {
    cron.schedule('0 */12 * * *', async () => {
        await updateMarketingTrends();
    });
    
    // Run immediately on startup
    updateMarketingTrends();
};

module.exports = {
    scheduleTrendsUpdate,
    updateMarketingTrends // Exported for testing purposes
}; 