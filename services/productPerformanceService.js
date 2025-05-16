const mongoose = require('mongoose');
const axios = require('axios');
const Product = require('../models/product');
const Order = require('../models/order');
const MarketTrend = require('../models/marketTrend');

class ProductPerformanceService {
    constructor() {
        this.AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';
    }

    async calculateSalesPerformance(productId, monthsBack = 1) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - monthsBack);

        // Get sales for current period
        const currentPeriodSales = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    'items.product': mongoose.Types.ObjectId(productId)
                }
            },
            {
                $unwind: '$items'
            },
            {
                $match: {
                    'items.product': mongoose.Types.ObjectId(productId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$items.quantity' }
                }
            }
        ]);

        // Get sales for previous period
        const previousStartDate = new Date(startDate);
        previousStartDate.setMonth(previousStartDate.getMonth() - monthsBack);
        const previousEndDate = new Date(startDate);

        const previousPeriodSales = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousStartDate, $lte: previousEndDate },
                    'items.product': mongoose.Types.ObjectId(productId)
                }
            },
            {
                $unwind: '$items'
            },
            {
                $match: {
                    'items.product': mongoose.Types.ObjectId(productId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$items.quantity' }
                }
            }
        ]);

        const currentSales = currentPeriodSales[0]?.totalQuantity || 0;
        const previousSales = previousPeriodSales[0]?.totalQuantity || 0;

        if (previousSales === 0) return 0;

        const percentageChange = ((currentSales - previousSales) / previousSales) * 100;
        return percentageChange;
    }

    async checkProductPerformance() {
        const products = await Product.find({ isActive: true });
        const underperformingProducts = [];

        for (const product of products) {
            const performanceChange = await this.calculateSalesPerformance(product._id);
            
            if (performanceChange <= -20) {
                underperformingProducts.push({
                    productId: product._id,
                    performanceChange,
                    product
                });
            }
        }

        return underperformingProducts;
    }

    async notifyAIAgent(productData) {
        try {
            await axios.post(`${this.AI_AGENT_URL}/products/analyze-performance`, {
                productId: productData.productId,
                performanceChange: productData.performanceChange,
                productDetails: productData.product
            });
        } catch (error) {
            console.error(`Failed to notify AI agent for product ${productData.productId}:`, error);
            throw error;
        }
    }
}

module.exports = new ProductPerformanceService();
