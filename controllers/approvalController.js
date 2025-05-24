const axios = require('axios');
const ApprovalRequest = require('../models/approvalRequestModel');

// Get all approval requests
const getAllApprovalRequests = async (req, res) => {
    try {
        const approvalRequests = await ApprovalRequest.find()
            .sort({ createdAt: -1 })
            .populate('productId', 'name sku images price');

        res.json(approvalRequests);
    } catch (error) {
        console.error('Error fetching approval requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific approval request
const getApprovalRequestById = async (req, res) => {
    try {
        const approvalRequest = await ApprovalRequest.findById(req.params.id)
            .populate('productId', 'name sku images price description');

        if (!approvalRequest) {
            return res.status(404).json({ message: 'Approval request not found' });
        }

        res.json(approvalRequest);
    } catch (error) {
        console.error(`Error fetching approval request ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an approval request (approve or reject)
const updateApprovalRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        console.log('requestId', requestId);
        const { status, adminComments } = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be either approved or rejected' });
        }
        
        const approvalRequest = await ApprovalRequest.findById(requestId);
        
        if (!approvalRequest) {
            return res.status(404).json({ message: 'Approval request not found' });
        }
        
        // Update status and comments
        approvalRequest.status = status;
        approvalRequest.adminComments = adminComments || '';
        approvalRequest.updatedAt = Date.now();
        
        await approvalRequest.save();
        
        // If approved, notify AI Agent to process the approval
        if (status === 'approved') {
            try {
                console.log('approvalRequest.suggestedAdjustment', approvalRequest.suggestedAdjustment);
                const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';
                await axios.post(`${AI_AGENT_URL}/products/process-approval`, {
                    suggested_adjustments: approvalRequest.suggestedAdjustments,
                    product_id: approvalRequest.productId,
                });
                console.log(`Successfully notified AI agent about approval of analysis ${approvalRequest._id}`);
            } catch (error) {
                console.error(`Error notifying AI agent about approval:`, error);
            }
        }
        
        res.json({
            message: `Approval request ${status}`,
            approvalRequest
        });
    } catch (error) {
        console.error(`Error updating approval request ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllApprovalRequests,
    getApprovalRequestById,
    updateApprovalRequest
}; 