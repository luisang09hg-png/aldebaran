const jobService = require('../services/job.service');
const prisma = require('../config/prisma');
const { processMedia } = require('../services/uploadService');

const getJobs = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await jobService.getJobs(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobService.getJobById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ data: job });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const authorId = req.userId;
    const job = await jobService.createJob(authorId, req.body);
    res.status(201).json({ data: job });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const authorId = req.userId;

    const job = await prisma.job.findUnique({ where: { id: parseInt(id, 10) } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.authorId !== authorId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedJob = await jobService.updateJob(id, req.body);
    res.json({ data: updatedJob });
  } catch (error) {
    next(error);
  }
};

const deactivateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const authorId = req.userId;

    const job = await prisma.job.findUnique({ where: { id: parseInt(id, 10) } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.authorId !== authorId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await jobService.deactivateJob(id);
    res.json({ message: 'Job deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const applicantId = req.userId;

    const parsedJobId = parseInt(jobId, 10);
    if (isNaN(parsedJobId)) {
      return res.status(400).json({ error: 'Invalid Job ID' });
    }

    // 1. Check job exists and is active
    const job = await prisma.job.findUnique({ where: { id: parsedJobId } });
    if (!job || !job.isActive) {
      return res.status(404).json({ error: 'Job not found or is inactive' });
    }

    // 2. Check if user already applied
    const existingApplication = await prisma.application.findFirst({
      where: { jobId: parsedJobId, applicantId }
    });
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    // 3. Process uploaded CV file via processMedia
    if (!req.file) {
      return res.status(400).json({ error: 'CV file is required' });
    }
    const cvUrl = await processMedia(req.file);

    // 4 & 5. Create Application and CvSubmission
    const application = await prisma.application.create({
      data: {
        jobId: parsedJobId,
        applicantId,
        status: 'SUBMITTED',
        cvSubmission: {
          create: {
            cvUrl
          }
        }
      },
      include: {
        cvSubmission: true
      }
    });

    // 6. Return 201
    res.status(201).json({ data: application });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deactivateJob,
  applyToJob
};
