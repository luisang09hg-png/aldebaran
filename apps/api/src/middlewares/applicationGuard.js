const { prisma } = require('../repositories/prisma');

const requireApplicationOwnership = async (req, res, next) => {
  try {
    const applicationId = parseInt(req.params.id, 10);
    const userId = req.user.id; // Asumiendo que auth middleware inyecta req.user

    if (isNaN(applicationId)) {
      return res.status(400).json({ error: 'ID de postulación inválido' });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    // Prevención IDOR: Solo el aplicante o el dueño del Job pueden acceder
    const isApplicant = application.applicantId === userId;
    const isJobOwner = application.job.authorId === userId;

    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({ error: 'Acceso denegado a este recurso' });
    }

    // Inyectamos el recurso validado
    req.application = application;
    req.isJobOwner = isJobOwner; // Guardamos el rol relativo a esta entidad para usarlo en el controlador
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireApplicationOwnership
};
