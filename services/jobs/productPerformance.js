const mongoose = require('mongoose');
const axios = require('axios');
const { Product} = require('../../models/productModel');
const OrderItem = require('../../models/orderItemModel');
const ApprovalRequest = require('../../models/approvalRequestModel');

class ProductPerformanceJob {
    constructor() {
        this.AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';
        this.PERFORMANCE_CHANGE_THRESHOLD = -20;
    }

    async calculateSalesPerformance(productId, monthsBack = 1) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - monthsBack);

        // Get sales for current period
        const currentPeriodSales = await OrderItem.aggregate([
            {
              $lookup: {
                from: 'orders',
                localField: 'orderId',
                foreignField: '_id',
                as: 'order'
              }
            },
            { $unwind: '$order' },
          
            {
              $match: {
                'order.createdAt': { $gte: startDate, $lte: endDate },
                productId: new mongoose.Types.ObjectId(productId)
              }
            },
          
            {
              $group: {
                _id: productId,
                totalQuantity: { $sum: 1 }
              }
            }
          ]);
        
        console.log('currentPeriodSales', currentPeriodSales);
        // Get sales for previous period
        const previousStartDate = new Date(startDate);
        previousStartDate.setMonth(previousStartDate.getMonth() - monthsBack);
        const previousEndDate = new Date(startDate);

        const previousPeriodSales = await OrderItem.aggregate([
        {
            $lookup: {
                from: 'orders',
                localField: 'orderId',
                foreignField: '_id',
                as: 'order'
            }
            },
            { $unwind: '$order' },
        
            {
            $match: {
                'order.createdAt': { $gte: previousStartDate, $lte: previousEndDate },
                productId: new mongoose.Types.ObjectId(productId)
            }
            },
        
            {
            $group: {
                _id: productId,
                totalQuantity: { $sum: 1 }
            }
            }
        ]);
        console.log('previousPeriodSales', previousPeriodSales);

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
            
            if (performanceChange <= this.PERFORMANCE_CHANGE_THRESHOLD) {
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
            const response = await axios.post(`${this.AI_AGENT_URL}/products/analyze-performance`, {
                productId: productData.productId,
                performanceChange: productData.performanceChange,
                productDetails: productData.product
            });
            
            if (response.status === 200) {
                const responseData = response.data;
                const analysisData = await ApprovalRequest.create({
                    productId: productData.productId,
                    performanceChange: productData.performanceChange,
                    analysisResult: responseData.analysis,
                    suggestedAdjustments: responseData.suggested_adjustments,
                    status: 'pending',
                });
                
                console.log(`Created approval request for product ${productData.productId} with analysis ID ${analysisData._id}`);
            } else {
                console.error(`AI agent returned non-200 status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Failed to notify AI agent for product ${productData.productId}:`, error);
            throw error;
        }
    }
}

module.exports = new ProductPerformanceJob();
