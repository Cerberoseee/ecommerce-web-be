const Customer = require('../models/customerModel');
const AppError = require('../utils/AppError');
const { Order } = require('../models/orderModel');
const { default: axios } = require('axios');

const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.find();
        if (customers.length === 0) {
            return next(new AppError('No customers found', 404));
        }
        res.status(200).json({
            code: 200,
            success: true,
            message: 'Get all customers successfully',
            result: customers
        })
    } catch (error) {
        return next(new AppError(`Error while getting all customers: ${error.message}`, 500));
    }
}

const getCustomersByPhoneNumber = async (req, res, next) => {
    try {
        const { phoneNumber } = req.params;
        if (!phoneNumber) {
            return next(new AppError('Phone number is required', 400));
        }
        const customers = await Customer.find({ phoneNumber });
        if (customers.length === 0) {
            return next(new AppError('No customers found', 404));
        }
        res.status(200).json({
            code: 200,
            success: true,
            message: 'Get customers successfully',
            result: customers
        });
    } catch (error) {
        return next(new AppError(`Error while getting customers: ${error.message}`, 500));
    }
}

const getCustomerById = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        if (!customerId) {
            return next(new AppError('customerId is required', 400));
        }
        const customers = await Customer.findById(customerId);
        if (customers.length === 0) {
            return next(new AppError('No customers found', 404));
        }
        res.status(200).json({
            code: 200,
            success: true,
            message: 'Get customers successfully',
            result: customers
        });
    } catch (error) {
        return next(new AppError(`Error while getting customers: ${error.message}`, 500));
    }
}

const createCustomer = async (req, res, next) => {
    try {
        const { customerName, phoneNumber, address, email } = req.body;
        const existingCustomer = await Customer.findOne({ phoneNumber });
        if (existingCustomer) {
            return next(new AppError('Phone number already exists', 400));
        }
        const customer = await Customer.create({ customerName, phoneNumber, address, email });
        res.status(201).json({
            code: 201,
            success: true,
            message: 'Customer created successfully',
            result: customer
        })
    } catch (error) {
        return next(new AppError(`Error while creating customer: ${error.message}`, 500));
    }
}

const updateCustomer = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        const { customerName, phoneNumber, address, email } = req.body;
        if (!customerName || !address || !phoneNumber) {
            return next(new AppError('Customer name, address and phone number are required', 400));
        }

        const existingCustomer = await Customer.findById(customerId);
        if (!existingCustomer) {
            return next(new AppError('Customer not found', 404));
        }

        const phoneNumberExists = await Customer.findOne({ phoneNumber });
        if (phoneNumberExists && phoneNumberExists._id.toString() !== customerId) {
            return next(new AppError('Phone number already exists', 400));
        }

        const customer = await Customer.findByIdAndUpdate(customerId, { customerName, phoneNumber, address, email }, { new: true });

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Customer updated successfully',
            result: customer
        });
    } catch (error) {
        return next(new AppError(`Error while updating customer: ${error.message}`, 500));
    }
}

const deleteCustomer = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return next(new AppError('Customer not found', 404));
        }
        await customer.deleteOne();

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Customer deleted successfully',
            result: customer
        })
    } catch (error) {
        return next(new AppError(`Error while deleting customer: ${error.message}`, 500));
    }
}

const getOrderHistoryByPhoneNumber = async (req, res, next) => {
    try {
        const { phoneNumber } = req.params;
        if (!phoneNumber) {
            return next(new AppError('Phone number is required!', 400));
        }
        const customer = await Customer.findOne({ phoneNumber });
        if (!customer) {
            return next(new AppError('Customer not found', 404));
        }

        const orders = await Order.find({ customerId: customer._id }).sort({ orderDate: -1 });
        if (orders.length === 0) {
            return next(new AppError('No orders found for this customer', 404));
        }

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Get order history successfully',
            result: {
                customer,
                orders
            }
        });
    } catch (error) {
        return next(new AppError(`Error while getting order history: ${error.message}`, 500));
    }
}

const buildCustomerProfile = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        if (!customerId) {
            return next(new AppError('Customer ID is required!', 400));
        }
        const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';
        const response = await axios.post(`${AI_AGENT_URL}/recommendations/build-user-profile`, {
            customer_id: customerId,
        });
        if (response.status === 200) {
            const customer = await Customer.findByIdAndUpdate(customerId, { profile: response.data }, { new: true });
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'Customer profile built successfully',
                result: customer
            });
        } else {
            return next(new AppError('Failed to build customer profile', 500));
        }

    } catch (error) {
        return next(new AppError(`Error while building customer profile: ${error.message}`, 500));
    }
}

module.exports = {
    getAllCustomers,
    getCustomersByPhoneNumber,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getOrderHistoryByPhoneNumber,
    buildCustomerProfile
}

