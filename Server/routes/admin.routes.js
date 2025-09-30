import { Router } from 'express';
import { getAggregatedUsers } from '../controllers/admin.controller.js';
import { isLoggedIn, authorizedRoles } from '../middlewares/auth.middlewares.js';

const router = Router();

router.route('/users')
    .get(isLoggedIn, authorizedRoles('ADMIN'), getAggregatedUsers);

export default router;