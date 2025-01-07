import express from 'express';
import apiRoutes from '../book-saw/book.routes';
const router = express.Router();

router.use('/', apiRoutes);

export default router;