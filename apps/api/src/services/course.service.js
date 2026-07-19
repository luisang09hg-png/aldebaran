const { prisma } = require('../repositories/prisma');

class CourseService {
  async getAllCourses(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      prisma.course.findMany({ skip, take: limit }),
      prisma.course.count()
    ]);
    return { courses, total, page, limit };
  }

  async getRecommendedCourses(userProfileSkills = '[]', page = 1, limit = 10) {
    // Basic recommendation logic: 
    // In SQLite we can't easily query JSON arrays, so we fetch all active and filter in memory for simplicity,
    // or just return some if skills match.
    // In a real PG environment we'd use array overlap operations.
    const allCourses = await prisma.course.findMany({ where: { isActive: true } });
    let parsedSkills = [];
    try {
      parsedSkills = JSON.parse(userProfileSkills);
    } catch(e) {}
    
    // Sort courses by how many skills overlap
    const coursesWithScore = allCourses.map(course => {
      let courseSkills = [];
      try {
        courseSkills = JSON.parse(course.skills);
      } catch(e) {}
      
      const overlap = parsedSkills.filter(s => courseSkills.includes(s)).length;
      return { ...course, score: overlap };
    });
    
    // Sort descending by score
    coursesWithScore.sort((a, b) => b.score - a.score);
    
    const skip = (page - 1) * limit;
    const paginated = coursesWithScore.slice(skip, skip + limit);
    return { courses: paginated, total: coursesWithScore.length, page, limit };
  }

  async createCourse(data) {
    return await prisma.course.create({ data });
  }
}

module.exports = new CourseService();
