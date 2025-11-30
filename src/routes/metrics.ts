import { Router } from 'express';

const router = Router();

router.get('/ceo', (req, res) => {
  const payload = {
    totalRevenue: 1234567.89,
    grossProfit: 456789.12,
    activeCustomers: 1234,
    orderVolume: 9876,
    revenueTrend: [
      { date: '2025-06-01', value: 80000 },
      { date: '2025-07-01', value: 90000 },
      { date: '2025-08-01', value: 110000 },
      { date: '2025-09-01', value: 130000 },
      { date: '2025-10-01', value: 150000 },
    ],
    categoryPerformance: [
      { category: 'Widgets', sales: 340000 },
      { category: 'Gadgets', sales: 260000 },
      { category: 'Bulk', sales: 180000 },
    ],
    salesByRegion: [
      { region: 'North', sales: 450000 },
      { region: 'South', sales: 300000 },
    ],
  };
  res.json(payload);
});

export default router;
