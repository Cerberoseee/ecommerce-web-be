const { Category } = require('../models/categoryModel');
const AppError = require('../utils/AppError');

const getAllCategories = async (req, res, next) => {
    const categories = await Category.find();
    if (!categories || categories.length === 0) {
        return next(new AppError('Categories not found'), 404);
    }
    res.status(200).json({
        code: 200,
        success: true,
        message: 'Categories fetched successfully.',
        result: categories
    });
};

const createCategory = async (req, res, next) => {
    const { categoryName, description } = req.body;
    const category = await Category.create({ categoryName, description });

    res.status(201).json({
        code: 201,
        success: true,
        message: 'Category created successfully.',
        result: category
    });
};
module.exports = { getAllCategories, createCategory };