import { Router } from 'express';

const router = Router();

router.get('/overview', (req, res) => {
  const payload = {
    monthlySalesTarget: 50000,
    commissionEarned: 2345.67,
    ordersThisWeek: 12,
    topCustomers: [
      { id: 'cust-1', name: 'Acme Corp', total: 12345 },
      { id: 'cust-2', name: 'Beta LLC', total: 9876 },
    ],
  };
  res.json(payload);
});

export default router;
