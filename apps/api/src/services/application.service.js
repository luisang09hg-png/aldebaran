const { prisma } = require('../repositories/prisma');

const ALLOWED_STATUSES = ['SUBMITTED', 'IN_REVIEW', 'INTERVIEW', 'REJECTED', 'ACCEPTED'];

class ApplicationService {
  async updateStatus(id, newStatus) {
    if (!ALLOWED_STATUSES.includes(newStatus)) {
      throw new Error(`Estado inválido. Debe ser uno de: ${ALLOWED_STATUSES.join(', ')}`);
    }

    return await prisma.application.update({
      where: { id: parseInt(id, 10) },
      data: { status: newStatus }
    });
  }

  async getApplicationsByUser(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { applicantId: userId },
        skip,
        take: limit,
        include: { job: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.application.count({ where: { applicantId: userId } })
    ]);

    return { applications, total, page, limit };
  }
}

module.exports = new ApplicationService();
