require('dotenv').config();
import { PreconditionFailedException } from "../common/error-exception";
import User from "../models/user";
import Admin from "../models/admin";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class adminService {

    /**
     * @description: admin Login Page
     * @param {*} req
     * @param {*} res
     */
    static async adminLoginPage(req, res) {
        return res.render('admin/login');
    }

    /**
     * @description: Admin Login
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async AdminLogin(data, req, res) {
        const admin = await Admin.findOne({ email: data.email });
        if (!admin) throw new PreconditionFailedException("Admin Not Found");

        const compareAdmin = bcrypt.compare(data.password, admin.password);
        if (!compareAdmin) throw new PreconditionFailedException("Wrong Password");

        const payload = {
            id: admin._id
        }
        
        const token = jwt.sign(payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        req.session.token = token;

        const users = await User.countDocuments({});
        return res.render('dashboard', { users });
    }

    /**
     * @description: Dashboard Page
     * @param {*} req
     * @param {*} res
     */
    static async dashboard(req, res) {
        const users = await User.countDocuments({});
        return res.render('dashboard', { users: users });
    }

    /**
     * @description: User Page
     * @param {*} req
     * @param {*} res
     */
    static async userPage(req, res) {
        return res.render('users/userTable');
    }

    /**
     * @description: User Logout
     * @param {*} req
     * @param {*} res
     */
    static async logout(req, res) {
        req.session.destroy(err => {
            if(err) {
                return res.redirect('admin/dashboard');
            } else {
                res.clearCookie('connect.sid');
                res.redirect('/admin/login');
            }
        });
    }   
}

export default adminService;    