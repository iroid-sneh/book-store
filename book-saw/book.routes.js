import express from 'express';
import bookController from './book.controller';
import auth from '../common/middleware/auth';
const router = express.Router();

router.get('/signup', bookController.signupPage);
router.post('/api/signup', bookController.signup);
router.get('/login', bookController.loginPage);
router.post('/login', bookController.login);
router.post('/add-to-cart', auth, bookController.addToCart);
router.get('/view-cart', auth, bookController.viewCartPage);
router.post('/view-cart', auth, bookController.viewCart);
router.delete(`/remove-cart-item/:id`, auth, bookController.removeItemFromCart);
router.post('/create-checkout-session', auth, bookController.stripePayment);
router.get('/success', auth, bookController.success);
router.get('/forgot-password', bookController.forgotPasswordPage);
router.post('/forgot-password', bookController.forgotPassword);
// router.get('/reset-code', bookController.resetCodePage);
// router.post('/reset-code', bookController.resetCode);
router.get('/reset-password/:token', bookController.setPasswordPage);
router.post('/reset-password/:token', bookController.setPassword);

export default router;