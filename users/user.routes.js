import express from 'express';
import userController from './user.controller/user.controller';
const router = express.Router();

router.get('/', userController);
router.post('/users', userController);

export default router;