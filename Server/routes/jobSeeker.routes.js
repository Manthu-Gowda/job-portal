import { Router } from 'express';
import {
  createOrUpdateProfile,
  getProfile,
  searchJobs,
  getJobDetails,
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getDashboardStats
} from '../controllers/jobSeeker.controller.js';
import { isLoggedIn, authorizedRoles } from '../middlewares/auth.middlewares.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

// Profile routes
router.post('/profile', isLoggedIn, authorizedRoles('JOB_SEEKER'), upload.single('resume'), createOrUpdateProfile);
router.get('/profile', isLoggedIn, authorizedRoles('JOB_SEEKER'), getProfile);

// Job search and application routes
router.get('/jobs/search', isLoggedIn, authorizedRoles('JOB_SEEKER'), searchJobs);
router.get('/jobs/:jobId', isLoggedIn, authorizedRoles('JOB_SEEKER'), getJobDetails);
router.post('/jobs/:jobId/apply', isLoggedIn, authorizedRoles('JOB_SEEKER'), applyForJob);

// Application management
router.get('/applications', isLoggedIn, authorizedRoles('JOB_SEEKER'), getMyApplications);
router.patch('/applications/:applicationId/withdraw', isLoggedIn, authorizedRoles('JOB_SEEKER'), withdrawApplication);

// Dashboard
router.get('/dashboard', isLoggedIn, authorizedRoles('JOB_SEEKER'), getDashboardStats);

export default router;