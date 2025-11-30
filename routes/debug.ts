import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const router = Router();

router.get('/users', async (req, res) => {
  try {
    const users = await AppDataSource.getRepository(User).find({ select: ['id', 'email', 'companyName', 'role'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'failed' });
  }
});

// Create or update test users (dev only)
router.post('/create-test-users', async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(User);
    const pass = await (await import('bcrypt')).hash('password', 8);
    const samples = [
      { email: 'ceo@example.com', password: pass, companyName: 'ACME', role: 'ceo' },
      { email: 'manager@example.com', password: pass, companyName: 'ACME', role: 'manager' },
      { email: 'sales@example.com', password: pass, companyName: 'ACME', role: 'sales' },
      { email: 'customer@example.com', password: pass, companyName: 'ACME', role: 'customer' },
    ];
    for (const s of samples) {
      const existing = await repo.findOneBy({ email: s.email });
      if (existing) {
        existing.role = s.role;
        existing.password = s.password;
        await repo.save(existing);
      } else {
        await repo.insert(s as any);
      }
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'failed' });
  }
});

export default router;
