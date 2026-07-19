const applicationService = require('../services/application.service');

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Solo el dueño del empleo (la empresa) debería poder cambiar el estado a "RECHAZADO", "ACEPTADO", etc.
    // El middleware ya calculó si el usuario es el dueño del job
    if (!req.isJobOwner) {
      return res.status(403).json({ error: 'Solo la empresa que publicó la oferta puede cambiar el estado de la postulación' });
    }

    const updatedApplication = await applicationService.updateStatus(id, status);
    res.json({ message: 'Estado actualizado exitosamente', data: updatedApplication });
  } catch (error) {
    if (error.message.includes('Estado inválido')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await applicationService.getApplicationsByUser(userId, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getApplicationDetails = async (req, res) => {
  // El middleware ya inyectó la aplicación validada en req.application
  res.json({ data: req.application });
};

const createApplication = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const applicantId = req.userId;
    const application = await applicationService.createApplication(applicantId, jobId);
    res.status(201).json({ data: application });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateStatus,
  getMyApplications,
  getApplicationDetails,
  createApplication
};
