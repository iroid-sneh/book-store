require('dotenv').config();
import crypto from 'crypto';
import User from '../models/user';
import Cart from '../models/cart';
import Nodemailer from 'nodemailer';
import session from 'express-session';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BadRequestException, NotFoundException, PreconditionFailedException, UnauthorizedException } from '../common/error-exception';
import { isArray } from 'lodash';
import Math from 'math';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class bookService {

    /**
     * @description: Sign Up Page 
     * @param {*} data
     * @param {*} res
     */
    static async signupPage(data, res) {
        return res.render('signup');
    }

    /**
     * @description: Sign Up For Users
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async signup(data, req, res) {
        const { name, email, password } = data;
        try {
            const findUser = await User.findOne({ email: email });
            if (findUser) {
                console.log("User already exists with this email.");
                throw new PreconditionFailedException("User Already Exists With Following Email");
            }

            const salt = await bcrypt.genSalt(12);
            const hashPassword = await bcrypt.hash(password, salt);

            const register = await User.create({
                name: name,
                email: email,
                password: hashPassword,
            });

            console.log("User registered successfully:", register);
            return ({
                register,
            });
        } catch (error) {
            console.error("Error during signup:", error);
        }
    }


    /**
     * @description: Login User Page
     * @param {*} req
     * @param {*} res
     */
    static async loginPage(req, res) {
        if (req.session.token) {
            jwt.verify(req.session.token, process.env.JWT_SECRET, (err, decode) => {
                if (err) {
                    return res.render('login')
                } else {
                    return res.redirect('/')
                }
            });
        } else {
            return res.render('login')
        }
    }

    /**
     * @description: Login Users
     * @param {*} data
     * @param {*} res
     */
    static async login(data, req, res) {
        const findUser = await User.findOne({ email: data.email });
        if (!findUser) {
            throw new PreconditionFailedException("User Not Found");
        }

        const comparePassword = await bcrypt.compare(data.password, findUser.password);
        if (!comparePassword) {
            throw new UnauthorizedException("Wrong Password");
        }

        let token = jwt.sign({ _id: findUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        req.session.token = token;

    }


    /**
     * @description: Add Items To Cart
     * @param {*} data
     * @param {*} req
    */
    static async addToCart(data, req) {
        const bookId = data.bookId;
        const userId = req.userId;

        const books = [
            { bookId: 1, title: 'Simple way of piece life', price: 40 },
            { bookId: 2, title: 'Great travel at desert', price: 38 },
            { bookId: 3, title: 'The lady beauty Scarlett', price: 45 },
            { bookId: 4, title: 'Once upon a time', price: 35 },
            { bookId: 5, title: 'Portrait photography', price: 40 },
            { bookId: 6, title: 'Tips of simple lifestyle', price: 40 },
            { bookId: 7, title: 'Just felt from outside', price: 40 },
            { bookId: 8, title: 'Peaceful Enlightment', price: 40 },
            { bookId: 9, title: 'Life among the pirates', price: 40 },
            { bookId: 10, title: 'Birds gonna be happy', price: 45 }
        ];

        const book = books.find(b => b.bookId === bookId);
        if (!book) {
            throw new NotFoundException("Book Not Found");
        }
        // console.log(book);
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        if (!Array.isArray(cart.items)) {
            cart.items = [];
        }

        const bookIndex = cart.items.findIndex(items => items.bookId === book.bookId);
        if (bookIndex !== -1) {
            cart.items[bookIndex].quantity += 1;
        } else {
            cart.items.push({
                bookId: book.bookId,
                title: book.title,
                price: book.price,
            })
        }
        await cart.save();
    }

    /**
     * @description: View Cart Page
     * @param {*} req 
     * @param {*} res 
     */
    static async viewCartPage(req, res) {
        return res.render('cart');
    }

    /**
     * @description: View Cart
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async ViewCart(data, req, res) {
        const userId = req.userId;
        // console.log(userId);
        const cart = await Cart.findOne({ userId });
        // console.log(cart);
        if (!cart || !Array.isArray(cart.items)) {
            return { items: [], total: 0, totalItems: 0 }
        }
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalItems = cart.items.reduce((count, item) => count + item.quantity, 0);

        return { items: cart.items, total, totalItems };
    }

    /**
     * @description: Remove Cart Item
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async removeCartItem(bookId, req, res) {
        const userId = req.userId;
        let cart = await Cart.findOne({ userId });
        const deleteBook = cart.items.findIndex(item => item.bookId === parseInt(bookId));

        // console.log(deleteBook);
        if (deleteBook === -1) {
            return ({ message: "Book not found in cart" });
        }

        if (cart.items[deleteBook].quantity > 1) {
            cart.items[deleteBook].quantity -= 1;
        } else {
            cart.items.splice(deleteBook, 1);
        }
        await cart.save();
    }

    /**
     * @description: Stripe Payment For the Cart
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async stripePayment(data, req, res) {
        const token = req.session.token;
        if (!token) {
            throw new UnauthorizedException("Unauthorized token");
        }
        const userId = req.userId;
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            throw new PreconditionFailedException("Cart Not Found or Empty");
        }
        const lineItems = cart.items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity
        }));

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: "http://localhost:8001/success",
                cancel_url: "http://localhost:8001/view-cart"
            })
            await cart.deleteOne({ userId });
            return session.url;
        } catch (error) {
            console.log("Error In Stripe Payment", error)
        }
    }

    /**
     * @description: Success Page For Payment
     * @param {*} req
     * @param {*} res
     */
    static async success(req, res) {
        return res.render('success');
    }

    /**
     * @description: Forgot Password Page
     * @param {*} req
     * @param {*} res
     */
    static async forgotPasswordPage(req, res) {
        return res.render('forgotpassword')
    }

    /**
     * @description: forgot User Password
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async forgotPassword(data, req, res) {
        const findUser = await User.findOne({ email: data.email });
        if (!findUser) {
            throw new NotFoundException("User Not Found With This Email");
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        findUser.resetToken = resetToken;
        findUser.resetTokenExpires = Date.now() + 15 * 60 * 1000
        findUser.save();

        const transporter = Nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: `${process.env.EMAIL_USER}`,
                pass: `${process.env.EMAIL_PASS}`,
                clientId: `${process.env.CLIENT_ID}`,
                clientSecret: `${process.env.CLIENT_SECRET}`,
                refreshToken: `${process.env.REFRESH_TOKEN}`,
                accessToken: `${process.env.ACCESS_TOKEN}`
            }
        })

        const mailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to: data.email,
            subject: 'Link For Reset Password',
            text: `Here is Your reset Password Link: http://localhost:8001/reset-password/${resetToken}`,
        }
        return transporter.sendMail(mailOptions, (err, res) => {
            if (err) {
                throw new BadRequestException("Error In Sending Reset Password Email", err);
            } else {
                res.send("Mail Sent Successfully");
            }
        })
    }

    /**
     * @description: Reset Password Page
     * @param {*} req
     * @param {*} res
     */
    static async setPasswordPage(req, res) {
        return res.render('resetpassword');
    }

    /**
     * @description: Set Password
     * @param {*} data
     * @param {*} resetToken
     */
    static async setPassword(data, resetToken) {
        const { newPassword } = data;
        const findUser = await User.findOne({
            resetToken: resetToken,
            resetTokenExpires: {
                $gt: new Date(), 
            },
        });

        if (!findUser) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        if (!newPassword || typeof newPassword !== 'string') {
            throw new BadRequestException('New password is required and must be a valid string');
        }

        const salt = await bcrypt.genSalt(12);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        findUser.password = hashedNewPassword;
        findUser.resetToken = undefined;
        findUser.resetTokenExpires = undefined;

        await findUser.save();
    }

};

export default bookService;