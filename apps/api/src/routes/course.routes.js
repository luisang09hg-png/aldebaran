const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

const mockAuthMiddleware = (req, res, next) => { 
  req.user = { id: 1 }; // Mock userId for development
  next(); 
};

// Obtener todos los cursos
router.get('/', courseController.getAllCourses);

// Obtener cursos recomendados para el usuario
router.get('/recommended', mockAuthMiddleware, courseController.getRecommendedCourses);

// Crear curso
router.post('/', mockAuthMiddleware, courseController.createCourse);

module.exports = router;
