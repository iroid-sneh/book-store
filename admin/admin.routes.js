import express from 'express';
import adminController from './admin.controller';
import userRoutes from '../users/user.routes';
import auth from '../common/middleware/admin/auth';
const router = express.Router();

router.get('/login', adminController.adminLoginPage);
router.post('/login', adminController.adminLogin);
router.use('/user', auth, userRoutes);
router.get('/dashboard', auth, adminController.dashboard);
router.get('/logout', auth, adminController.logout);

export default router;