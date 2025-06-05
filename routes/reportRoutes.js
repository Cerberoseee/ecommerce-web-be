const express = require('express');
const { getSalesReport, getProductReport } = require('../controllers/reportController');
const { protect, checkPasswordReset, checkLocked } = require('../middlewares/auth'); // Middleware bảo vệ
const { isAdmin } = require('../middlewares/role');

const router = express.Router();

router.post('/sales', protect, checkPasswordReset, checkLocked, getSalesReport);
router.post('/products', protect, checkPasswordReset, checkLocked, getProductReport);

module.exports = router;
/**
 * @swagger
 * /api/reports/sales:
 *   post:
 *     summary: Lấy báo cáo doanh số
 *     tags: [Reports]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-07-03"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-07-16"
 *     parameters:
 *       - in: query
 *         name: timeline
 *         required: false
 *         description: Thời gian báo cáo (today, yesterday, last7days, thisMonth)
 *         schema:
 *           type: string
 *           example: "today"
 *     responses:
 *       200:
 *         description: Thành công, trả về báo cáo doanh số
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAmountReceived:
 *                   type: number
 *                   example: 150000
 *                 totalOrders:
 *                   type: number
 *                   example: 10
 *                 totalProducts:
 *                   type: number
 *                   example: 25
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                         example: "60d5ec49f1b2c8b1f8e4e1a1"
 *                       customerId:
 *                         type: string
 *                         example: "60d5ec49f1b2c8b1f8e4e1a2"
 *                       amountReceived:
 *                         type: number
 *                         example: 15000
 *                       orderDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-07-03T10:00:00Z"
 *       500:
 *         description: Lỗi khi lấy báo cáo
 */

/**
 * @swagger
 * /api/reports/products:
 *   post:
 *     summary: Get product report
 *     description: Retrieve product sales report based on date filters.
 *     tags: [Reports]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-07-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-07-31"
 *     parameters:
 *       - in: query
 *         name: timeline
 *         required: false
 *         description: Thời gian báo cáo (today, yesterday, last7days, thisMonth)
 *         schema:
 *           type: string
 *           example: "thisMonth"
 *     responses:
 *       200:
 *         description: Successful response with product report data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           productName:
 *                             type: string
 *                           totalSold:
 *                             type: integer
 *                           stockQuantity:
 *                             type: integer
 *                           isActive:
 *                             type: boolean
 *       500:
 *         description: Internal server error.
 */