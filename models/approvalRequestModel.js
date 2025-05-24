const mongoose = require('mongoose');

const approvalRequestSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    performanceChange: {
        type: Number,
        required: true
    },
    analysisResult: {
        type: String,
        required: true
    },
    suggestedAdjustments: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminComments: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('ApprovalRequest', approvalRequestSchema); 