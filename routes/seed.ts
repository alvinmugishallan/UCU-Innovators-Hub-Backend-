import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Product);
    const count = await repo.count();

    const samples = [
      { name: 'Beans', price: 1200, description: 'High-quality dry beans per kg' },
      { name: 'Grain Maize', price: 900, description: 'Clean grain maize per kg' },
      { name: 'Cowpeas', price: 1500, description: 'Fresh cowpeas per kg' },
      { name: 'Groundnuts (G-nuts)', price: 3500, description: 'Red & white groundnuts per kg' },
      { name: 'Rice', price: 2800, description: 'Sorted rice per kg' },
      { name: 'Soybeans', price: 1300, description: 'Organic soybeans per kg' },
    ];

    // Use insert with partials to avoid TypeScript overload mismatch when building
    // insert accepts partial objects and is faster for seeding simple data
    if (count === 0) {
      await repo.insert(samples as any);
    }

    // Seed sample users if none exist
    const userRepo = AppDataSource.getRepository(User);
    const userCount = await userRepo.count();
    if (userCount === 0) {
      const pass = await bcrypt.hash('password', 8);
      const users = [
        { email: 'ceo@example.com', password: pass, companyName: 'ACME', role: 'ceo' },
        { email: 'manager@example.com', password: pass, companyName: 'ACME', role: 'manager' },
        { email: 'sales@example.com', password: pass, companyName: 'ACME', role: 'sales' },
        { email: 'customer@example.com', password: pass, companyName: 'ACME', role: 'customer' },
      ];
      await userRepo.insert(users as any);
    }

    return res.json({ seeded: true, count: samples.length });
  } catch (err) {
    console.error('Seed error', err);
    return res.status(500).json({ error: 'Failed to seed' });
  }
});

export default router;
