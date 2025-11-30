import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Project } from '../entities/Project';
import { User } from '../entities/User';
const router = Router();
const repo = () => AppDataSource.getRepository(Project);
const userRepo = () => AppDataSource.getRepository(User);

// Get all projects with filtering
router.get('/', async (req, res) => {
  try {
    const { role, category, search, faculty, department, year, technology } = req.query;
    const query = repo().createQueryBuilder('project')
      .leftJoinAndSelect('project.author', 'author')
      .leftJoinAndSelect('project.supervisor', 'supervisor');

    // Filter by role
    if (role === 'public') {
      query.andWhere('project.status = :status', { status: 'approved' });
    }

    // Filter by category
    if (category) {
      query.andWhere('project.category = :category', { category });
    }

    // Filter by faculty
    if (faculty) {
      query.andWhere('project.faculty = :faculty', { faculty });
    }

    // Filter by department
    if (department) {
      query.andWhere('project.department = :department', { department });
    }

    // Filter by year
    if (year) {
      query.andWhere('project.year = :year', { year: Number(year) });
    }

    // Filter by technology
    if (technology) {
      query.andWhere('project.technologies LIKE :technology', { technology: `%${technology}%` });
    }

    // Search in title, description, and technologies
    if (search) {
      query.andWhere('(project.title LIKE :search OR project.description LIKE :search OR project.technologies LIKE :search)', {
        search: `%${search}%`
      });
    }

    const projects = await query.getMany();
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await repo().findOne({
      where: { id: Number(req.params.id) },
      relations: ['author', 'supervisor']
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const { title, description, category, technologies, githubLink, documentUrl, authorId } = req.body;
    const author = await userRepo().findOneBy({ id: authorId });
    if (!author) return res.status(400).json({ error: 'Author not found' });

    const project = repo().create({
      title,
      description,
      category,
      technologies,
      githubLink,
      documentUrl,
      author
    });

    const saved = await repo().save(project);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { title, description, category, technologies, githubLink, documentUrl, faculty, department, year } = req.body;
    const project = await repo().findOneBy({ id: Number(req.params.id) });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    Object.assign(project, { title, description, category, technologies, githubLink, documentUrl, faculty, department, year });
    const saved = await repo().save(project);
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const result = await repo().delete(req.params.id);
    if (result.affected === 0) return res.status(404).json({ error: 'Project not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Submit project for review
router.post('/:id/submit', async (req, res) => {
  try {
    const project = await repo().findOneBy({ id: Number(req.params.id) });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.status = 'pending';
    await repo().save(project);
    res.json({ message: 'Project submitted for review' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit project' });
  }
});

// Approve project
router.put('/:id/approve', async (req, res) => {
  try {
    const { supervisorId } = req.body;
    const project = await repo().findOneBy({ id: Number(req.params.id) });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const supervisor = await userRepo().findOneBy({ id: supervisorId });
    if (!supervisor || supervisor.role !== 'supervisor') return res.status(403).json({ error: 'Unauthorized' });

    project.status = 'approved';
    project.supervisor = supervisor;
    await repo().save(project);
    res.json({ message: 'Project approved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve project' });
  }
});

// Reject project
router.put('/:id/reject', async (req, res) => {
  try {
    const { supervisorId, reason } = req.body;
    const project = await repo().findOneBy({ id: Number(req.params.id) });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const supervisor = await userRepo().findOneBy({ id: supervisorId });
    if (!supervisor || supervisor.role !== 'supervisor') return res.status(403).json({ error: 'Unauthorized' });

    project.status = 'rejected';
    project.supervisor = supervisor;
    project.rejectionReason = reason;
    await repo().save(project);
    res.json({ message: 'Project rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject project' });
  }
});

// Get pending projects for supervisors
router.get('/pending', async (req, res) => {
  try {
    const projects = await repo().find({
      where: { status: 'pending' },
      relations: ['author']
    });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending projects' });
  }
});

export default router;
