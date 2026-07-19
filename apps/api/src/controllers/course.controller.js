const courseService = require('../services/course.service');
const { prisma } = require('../repositories/prisma');

const getAllCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await courseService.getAllCourses(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getRecommendedCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Fetch user profile to get skills
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId }
    });

    const skills = userProfile ? userProfile.skills : '[]';
    
    const result = await courseService.getRecommendedCourses(skills, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    // Assuming validation via middleware
    const course = await courseService.createCourse(req.body);
    res.status(201).json({ data: course });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getRecommendedCourses,
  createCourse
};
