const mongoose = require('mongoose');

const marketingTrendsSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
    },
    searchVolume: {
        type: Number,
        required: true,
    },
    relatedQueries: [{
        query: String,
        score: Number
    }],
    timestamp: {
        type: Date,
        default: Date.now
    },
    region: {
        type: String,
        default: 'VN'
    },
    category: {
        type: String,
    }
}, {
    timestamps: true
});

// Index for efficient querying
marketingTrendsSchema.index({ keyword: 1, timestamp: -1 });

const MarketingTrends = mongoose.model('MarketingTrends', marketingTrendsSchema);

module.exports = MarketingTrends; 