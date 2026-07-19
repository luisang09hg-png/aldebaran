const prisma = require('../config/prisma');

class JobService {
  async getJobs({ search, location, page, limit }) {
    const skip = (page - 1) * limit;
    const where = { isActive: true };

    if (search) {
      where.title = { contains: search };
    }

    if (location) {
      where.location = { contains: location };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    return { jobs, total, page, limit };
  }

  async getJobById(id) {
    return await prisma.job.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        author: {
          select: {
            id: true,
            profile: {
              select: {
                name: true,
                avatarUrl: true
              }
            }
          }
        },
        _count: {
          select: { applications: true }
        }
      }
    });
  }

  async createJob(authorId, data) {
    return await prisma.job.create({
      data: {
        ...data,
        authorId
      }
    });
  }

  async updateJob(id, data) {
    return await prisma.job.update({
      where: { id: parseInt(id, 10) },
      data
    });
  }

  async deactivateJob(id) {
    return await prisma.job.update({
      where: { id: parseInt(id, 10) },
      data: { isActive: false }
    });
  }
}

module.exports = new JobService();
