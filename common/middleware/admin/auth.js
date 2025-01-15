require('dotenv').config();
import jwt from 'jsonwebtoken';

export default async function (req, res, next) {
    if (req.session.token) {
        jwt.verify(req.session.token,
            process.env.JWT_SECRET,
            (err, decode) => {
                if (err) {
                    res.redirect('/admin/login');
                } else {
                    next();
                }
            }
        );
    } else {
        res.redirect('/admin/login');
    }
}
