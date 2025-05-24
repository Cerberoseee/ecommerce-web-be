const cron = require('node-cron');
const { getJson } = require('serpapi');
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

// Configure with your SerpApi key
const SERPAPI_KEY = process.env.SERPAPI_KEY;
// Delay between API calls to avoid rate limiting
const API_DELAY = 5000; // 5 seconds

// Helper function to wait
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchTrendsData(keyword) {
    try {
        console.log(`Fetching trends data for: ${keyword}`);
        
        // Wait between requests to prevent SerpAPI rate limits
        await delay(API_DELAY);
        
        // Step 1: Get interest over time data
        const timeSeriesParams = {
            engine: "google_trends",
            q: keyword,
            data_type: "TIMESERIES", 
            date: "now 7-d",
            geo: "VN",
            tz: "420", // UTC+7 for Vietnam
            api_key: SERPAPI_KEY
        };
        
        const timeSeriesData = await getJson(timeSeriesParams);
        
        // Calculate average search volume from timeline data
        const timeline = timeSeriesData.interest_over_time?.timeline_data || [];
        let searchVolume = 0;
        
        if (timeline.length > 0) {
            const sum = timeline.reduce((acc, item) => {
                const value = item.values[0]?.extracted_value || 0;
                return acc + value;
            }, 0);
            searchVolume = sum / timeline.length;
        }
        
        // Wait between requests
        await delay(API_DELAY);
        
        // Step 2: Get related queries data
        const relatedQueriesParams = {
            engine: "google_trends",
            q: keyword,
            data_type: "RELATED_QUERIES",
            geo: "VN",
            api_key: SERPAPI_KEY
        };
        
        const relatedQueriesData = await getJson(relatedQueriesParams);
        
        // Extract top 5 related queries
        const relatedQueries = [];
        const topQueries = relatedQueriesData.related_queries?.top_queries || [];
        
        for (let i = 0; i < Math.min(topQueries.length, 5); i++) {
            const query = topQueries[i];
            relatedQueries.push({
                query: query.query,
                score: query.value || query.extracted_value || 0
            });
        }
        
        return {
            keyword,
            searchVolume,
            relatedQueries
        };
    } catch (error) {
        console.error(`Error fetching trends for ${keyword} via SerpApi:`, error);
        return null;
    }
}

async function updateMarketingTrends() {
    console.log('Starting marketing trends update via SerpAPI...');
    
    if (!SERPAPI_KEY) {
        console.error('SERPAPI_KEY environment variable is not set. Cannot proceed with trends update.');
        return;
    }
    
    for (const keyword of KEYWORDS) {
        try {
            const trendsData = await fetchTrendsData(keyword);
            
            if (trendsData) {
                await MarketingTrends.create(trendsData);
                console.log(`Successfully updated trends for: ${keyword}`);
            }
            
            // Add delay between keywords
            await delay(10000); // 10 seconds
        } catch (error) {
            console.error(`Failed to update trends for ${keyword}:`, error);
        }
    }
    
    console.log('Marketing trends update completed');
}

const scheduleTrendsUpdate = () => {
    // Run every Sunday at 00:00
    cron.schedule('0 0 * * 0', async () => {
        await updateMarketingTrends();
    });
};

module.exports = {
    scheduleTrendsUpdate,
    updateMarketingTrends // Exported for testing purposes
}; 