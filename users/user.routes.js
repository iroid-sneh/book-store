import express from 'express';
import userController from './user.controller/user.controller';
const router = express.Router();

router.get('/', userController.userPage);
router.get('/users', userController.userList);

export default router;