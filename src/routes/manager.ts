import { Router } from 'express';

const router = Router();

router.get('/overview', (req, res) => {
  const payload = {
    teamSales: 45234.5,
    orderProcessingTimeHours: 12.5,
    inventoryHealth: 'Good',
    pendingApprovals: [
      { id: 'po-1', type: 'purchase_order', title: 'PO #1001', amount: 1500, submittedBy: 'alice' },
      { id: 'leave-1', type: 'leave_request', title: 'Leave request - Bob', submittedBy: 'bob' },
      { id: 'price-1', type: 'price_override', title: 'Override - SKU-1234', submittedBy: 'carol' },
    ],
  };
  res.json(payload);
});

router.post('/approve', (req, res) => {
  const { id } = req.body;
  // In a real app you'd update DB; here we return success
  res.json({ success: true, id });
});

export default router;
