const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const AppError = require('../utils/AppError');

exports.recommendPersonalized = async (req, res, next) => {
    try {
        const { user_id, max_results = 5 } = req.body;

        const products = await Product.find().limit(max_results);

        res.status(200).json({
            success: true,
            recommendations: products.map(p => ({
                product_id: p._id,
                name: p.productName,
                score: Math.random().toFixed(2)
            }))
        });
    } catch (error) {
        return next(new AppError(`Error in personalized recommendation: ${error.message}`, 500));
    }
};

exports.recommendByCategory = async (req, res, next) => {
    try {
        const { category, max_results = 5 } = req.body;

        const products = await Product.find({
            categoryId: new RegExp(`^${category}-`, 'i')
        }).limit(max_results);

        res.status(200).json({
            success: true,
            recommendations: products.map(p => ({
                product_id: p._id,
                name: p.productName,
                score: Math.random().toFixed(2)
            }))
        });
    } catch (error) {
        return next(new AppError(`Error in category recommendation: ${error.message}`, 500));
    }
};

// 📈 GET trending products
exports.recommendTrending = async (req, res, next) => {
    try {
        const { max_results = 5 } = req.query;

        const products = await Product.find().sort({ stockQuantity: -1 }).limit(Number(max_results));

        res.status(200).json({
            success: true,
            recommendations: products.map(p => ({
                product_id: p._id,
                name: p.productName,
                score: Math.random().toFixed(2)
            }))
        });
    } catch (error) {
        return next(new AppError(`Error in trending recommendation: ${error.message}`, 500));
    }
};

// 🧩 POST related products
exports.recommendRelated = async (req, res, next) => {
    try {
        const { product_id, max_results = 5 } = req.body;

        const product = await Product.findById(product_id);
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        const related = await Product.find({
            categoryId: product.categoryId,
            _id: { $ne: product._id }
        }).limit(max_results);

        res.status(200).json({
            success: true,
            recommendations: related.map(p => ({
                product_id: p._id,
                name: p.productName,
                score: Math.random().toFixed(2)
            }))
        });
    } catch (error) {
        return next(new AppError(`Error in related recommendation: ${error.message}`, 500));
    }
};
