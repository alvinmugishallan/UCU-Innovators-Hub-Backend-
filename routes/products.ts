import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
const router = Router();
const repo = () => AppDataSource.getRepository(Product);

router.get('/', async (req, res) => {
  const list = await repo().find();
  res.json(list);
});

router.get('/:id', async (req, res) => {
  const p = await repo().findOneBy({ id: Number(req.params.id) });
  if (!p) return res.status(404).end();
  res.json(p);
});

export default router;