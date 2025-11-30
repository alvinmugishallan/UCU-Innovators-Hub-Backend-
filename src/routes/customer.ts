import { Router } from 'express';

const router = Router();

router.get('/account', (req, res) => {
  const payload = {
    currentBalance: 1250.5,
    availableCredit: 5000,
    nextPaymentDue: '2025-12-01',
    recentOrders: [
      { id: 'ord-1001', date: '2025-10-01', total: 450.5, status: 'delivered' },
      { id: 'ord-1002', date: '2025-10-21', total: 300.0, status: 'processing' },
    ],
  };
  res.json(payload);
});

export default router;
