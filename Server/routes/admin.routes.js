import { Router } from 'express';
import { getAdminStats } from '../controllers/admin.controller.js';
import { isLoggedIn, authorizedRoles } from '../middlewares/auth.middlewares.js';

const router = Router();

router.get('/stats', isLoggedIn, authorizedRoles('ADMIN'), getAdminStats);

export default router;