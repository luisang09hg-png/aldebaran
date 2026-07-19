const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { requireApplicationOwnership } = require('../middlewares/applicationGuard');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { createApplicationSchema, updateStatusSchema } = require('../models/applicationSchemas');

// Crear una postulación básica
router.post('/', authMiddleware, validate(createApplicationSchema), applicationController.createApplication);

// Obtener mis postulaciones (paginadas)
router.get('/', authMiddleware, applicationController.getMyApplications);

// Obtener detalle de una postulación (Status Tracker)
router.get('/:id', authMiddleware, requireApplicationOwnership, applicationController.getApplicationDetails);

// Actualizar el estado de la postulación
router.patch('/:id/status', authMiddleware, requireApplicationOwnership, validate(updateStatusSchema), applicationController.updateStatus);

module.exports = router;
