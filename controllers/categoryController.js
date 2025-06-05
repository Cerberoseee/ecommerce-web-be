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

    setImmediate(async () => {
        try {
            await axios.post(`${process.env.AI_AGENT_URL}/categories/insert-embedding`, {
                categoryName: category.categoryName,
                description: category.description,
            });
        } catch (error) {
            console.error('Error in insert embedding:', error);
            throw error;
        }
    })

    res.status(201).json({
        code: 201,
        success: true,
        message: 'Category created successfully.',
        result: category
    });
};
module.exports = { getAllCategories, createCategory };