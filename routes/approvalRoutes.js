const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/roleMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const { 
    getAllApprovalRequests, 
    getApprovalRequestById, 
    updateApprovalRequest 
} = require('../controllers/approvalController');

/**
 * @swagger
 * /api/approval/{requestId}:
 *   put:
 *     summary: Update approval request
 *     description: Update approval request
 *     tags:
 *       - Approval
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *           example: 664b6b7b5462616b6b6b6b6b
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: approved
 *               adminComments:
 *                 type: string
 *                 example: The product is performing well.
 *     responses:
 *       200:
 *         description: Approval request updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 */

// Get all approval requests
router.get('/', protect, isAdmin, getAllApprovalRequests);

// Get a specific approval request
router.get('/:id', protect, isAdmin, getApprovalRequestById);

// Update an approval request (approve or reject)
router.put('/:requestId', protect, isAdmin, updateApprovalRequest);

module.exports = router; 