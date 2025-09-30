import { Router } from 'express';
import {
  createOrUpdateProfile,
  getProfile,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobApplications,
  updateApplicationStatus,
  scheduleInterview,
  getDashboardStats,
  getAnalytics
} from '../controllers/jobProvider.controller.js';
import { isLoggedIn, authorizedRoles } from '../middlewares/auth.middlewares.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

// Profile routes
router.post('/profile', isLoggedIn, authorizedRoles('JOB_PROVIDER'), upload.single('logo'), createOrUpdateProfile);
router.get('/profile', isLoggedIn, authorizedRoles('JOB_PROVIDER'), getProfile);

// Job management routes
router.post('/jobs', isLoggedIn, authorizedRoles('JOB_PROVIDER'), createJob);
router.get('/jobs', isLoggedIn, authorizedRoles('JOB_PROVIDER'), getMyJobs);
router.put('/jobs/:jobId', isLoggedIn, authorizedRoles('JOB_PROVIDER'), updateJob);
router.delete('/jobs/:jobId', isLoggedIn, authorizedRoles('JOB_PROVIDER'), deleteJob);

// Application management routes
router.get('/jobs/:jobId/applications', isLoggedIn, authorizedRoles('JOB_PROVIDER'), getJobApplications);
router.patch('/applications/:applicationId/status', isLoggedIn, authorizedRoles('JOB_PROVIDER'), updateApplicationStatus);
router.post('/applications/:applicationId/interview', isLoggedIn, authorizedRoles('JOB_PROVIDER'), scheduleInterview);

// Dashboard and analytics
router.get('/dashboard', isLoggedIn, authorizedRoles('JOB_PROVIDER'), getDashboardStats);
router.get('/analytics', isLoggedIn, authorizedRoles('JOB_PROVIDER'), getAnalytics);

export default router;