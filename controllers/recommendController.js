const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const AppError = require('../utils/AppError');

// Personalized recommendation: sản phẩm mà user đã mua nhiều nhất
exports.recommendPersonalized = async (req, res, next) => {
    try {
        const { user_id, max_results = 5 } = req.body;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return next(new AppError('Invalid user ID', 400));
        }

        const orders = await Order.find({ userId: user_id });
        const orderIds = orders.map(order => order._id);

        const orderItems = await OrderItem.find({ orderId: { $in: orderIds } });

        const productCountMap = {};
        orderItems.forEach(item => {
            const pid = item.productId.toString();
            productCountMap[pid] = (productCountMap[pid] || 0) + 1;
        });

        const sortedProductIds = Object.entries(productCountMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, max_results)
            .map(entry => entry[0]);

        const products = await Product.find({ _id: { $in: sortedProductIds } });

        const recommendations = sortedProductIds.map(pid => {
            const product = products.find(p => p._id.toString() === pid);
            return product
                ? {
                      product_id: product._id,
                      name: product.productName,
                      score: productCountMap[pid]
                  }
                : null;
        }).filter(Boolean);

        res.status(200).json({
            success: true,
            recommendations
        });
    } catch (error) {
        return next(new AppError(`Error in personalized recommendation: ${error.message}`, 500));
    }
};

// Trending products: sản phẩm bán chạy nhất 7 ngày gần đây
exports.recommendTrending = async (req, res, next) => {
    try {
        const { max_results = 5 } = req.query;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentOrders = await Order.find({ orderDate: { $gte: sevenDaysAgo } });
        const orderIds = recentOrders.map(order => order._id);

        const orderItems = await OrderItem.find({ orderId: { $in: orderIds } });

        const productSales = {};
        orderItems.forEach(item => {
            const pid = item.productId.toString();
            productSales[pid] = (productSales[pid] || 0) + 1;
        });

        const sortedProductIds = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, Number(max_results))
            .map(([pid]) => pid);

        const products = await Product.find({ _id: { $in: sortedProductIds } });

        const recommendations = sortedProductIds.map(pid => {
            const product = products.find(p => p._id.toString() === pid);
            return product
                ? {
                      product_id: product._id,
                      name: product.productName,
                      score: productSales[pid]
                  }
                : null;
        }).filter(Boolean);

        res.status(200).json({
            success: true,
            recommendations
        });
    } catch (error) {
        return next(new AppError(`Error in trending recommendation: ${error.message}`, 500));
    }
};

// Related products: sản phẩm cùng category và bán chạy
exports.recommendRelated = async (req, res, next) => {
    try {
        const { product_id, max_results = 5 } = req.body;

        if (!mongoose.Types.ObjectId.isValid(product_id)) {
            return next(new AppError('Invalid product ID', 400));
        }

        const baseProduct = await Product.findById(product_id);
        if (!baseProduct) {
            return next(new AppError('Product not found', 404));
        }

        // Tìm các sản phẩm khác cùng category
        const candidates = await Product.find({
            categoryId: baseProduct.categoryId,
            _id: { $ne: product_id }
        });

        // Lấy order items có productId thuộc candidates
        const candidateIds = candidates.map(p => p._id);
        const orderItems = await OrderItem.find({ productId: { $in: candidateIds } });

        const productSales = {};
        orderItems.forEach(item => {
            const pid = item.productId.toString();
            productSales[pid] = (productSales[pid] || 0) + 1;
        });

        const sortedProductIds = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, max_results)
            .map(([pid]) => pid);

        const recommendations = sortedProductIds.map(pid => {
            const product = candidates.find(p => p._id.toString() === pid);
            return product
                ? {
                      product_id: product._id,
                      name: product.productName,
                      score: productSales[pid]
                  }
                : null;
        }).filter(Boolean);

        res.status(200).json({
            success: true,
            recommendations
        });
    } catch (error) {
        return next(new AppError(`Error in related recommendation: ${error.message}`, 500));
    }
};
