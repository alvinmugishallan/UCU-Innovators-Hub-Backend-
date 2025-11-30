import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const userRepo = () => AppDataSource.getRepository(User);

router.post('/signup', async (req, res) => {
  const { email, password, companyName, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const repo = userRepo();
  const existing = await repo.findOneBy({ email });
  if (existing) return res.status(409).json({ message: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);
  const userRole = role || 'customer';
  const user = repo.create({ email, password: hashed, companyName, role: userRole });
  await repo.save(user);
  return res.status(201).json({ id: user.id, email: user.email, companyName: user.companyName });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for email: ${email}`);
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const repo = userRepo();
  const user = await repo.findOneBy({ email });
  console.log(`User found: ${!!user}`);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  console.log(`Password match: ${ok}`);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

  return res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, companyName: user.companyName },
  });
});

router.post('/refresh', (req, res) => {
  const { token } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    const accessToken = jwt.sign({ sub: (payload as any).sub }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).end();
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    const repo = userRepo();
    const user = await repo.findOneBy({ id: payload.sub });
    if (!user) return res.status(404).end();
    return res.json({ id: user.id, email: user.email, companyName: user.companyName, role: user.role });
  } catch {
    return res.status(401).end();
  }
});

export default router;