const express = require('express');
const multer = require('multer');
const router = express.Router();

const jobController = require('../controllers/job.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const { validateQuery } = require('../middlewares/validateQuery');
const { createJobSchema, updateJobSchema, jobQuerySchema } = require('../models/jobSchemas');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});
const cvUploadMiddleware = upload.single('cv');

router.get('/', validateQuery(jobQuerySchema), jobController.getJobs);
router.get('/:id', jobController.getJobById);

router.post('/', authMiddleware, validate(createJobSchema), jobController.createJob);
router.put('/:id', authMiddleware, validate(updateJobSchema), jobController.updateJob);
router.delete('/:id', authMiddleware, jobController.deactivateJob);

router.post('/:jobId/apply', authMiddleware, cvUploadMiddleware, jobController.applyToJob);

module.exports = router;
