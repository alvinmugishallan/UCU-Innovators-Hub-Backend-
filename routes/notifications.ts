import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const notifications = [
    { id: '1', message: 'New order #1023 placed', type: 'info' },
    { id: '2', message: 'Low stock on SKU-1234', type: 'error' },
    { id: '3', message: 'Monthly report available', type: 'success' },
  ];
  res.json(notifications);
});

export default router;
