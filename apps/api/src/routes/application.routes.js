const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { requireApplicationOwnership } = require('../middlewares/applicationGuard');
// Asumimos la existencia de un middleware de autenticación (por ejemplo authMiddleware.verifyToken)
// Aquí definiremos un mock simple para que no falle la importación si no existe
const mockAuthMiddleware = (req, res, next) => { 
  req.user = { id: 1 }; // Mock userId for development
  next(); 
};

// Obtener mis postulaciones (paginadas)
router.get('/', mockAuthMiddleware, applicationController.getMyApplications);

// Obtener detalle de una postulación (Status Tracker)
router.get('/:id', mockAuthMiddleware, requireApplicationOwnership, applicationController.getApplicationDetails);

// Actualizar el estado de la postulación
router.patch('/:id/status', mockAuthMiddleware, requireApplicationOwnership, applicationController.updateStatus);

module.exports = router;
