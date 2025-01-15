import express from 'express';
import apiRoutes from '../book-saw/book.routes';
import adminRoutes from '../admin/admin.routes';
const router = express.Router();

router.use('/', apiRoutes);
router.use('/admin', adminRoutes);

router.get("/admin", (req, res) => {
    return res.redirect('/admin/login')
});

export default router;