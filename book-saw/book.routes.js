import express from 'express';
import bookController from './book.controller';
import auth from '../common/middleware/auth';
const router = express.Router();

router.get('/', bookController);
router.get('/signup', bookController.signupPage);
router.post('/api/signup', bookController.signup);
router.get('/login', bookController.loginPage);
router.post('/login', bookController.login);
router.post('/add-to-cart', auth, bookController.addToCart);
router.get('/view-cart', auth, bookController.viewCartPage);
router.post('/view-cart', auth, bookController.viewCart);
router.delete(`/remove-cart-item/:id`, auth, bookController.removeItemFromCart);
router.get('/check-out', auth, bookController.stripePage);

export default router;