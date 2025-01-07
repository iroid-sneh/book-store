require('dotenv').config();
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../error-exception';

export default async function (req, res, next) {
   if(req.session.token)  {
    const token = req.session.token;
    if (!token) {
        throw new UnauthorizedException("Token Not Found");
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decode._id;
        next();
    } catch (error) {
        console.log("Error In Authorization", error);
    }
   } else {
    return res.redirect('/login');
   }
}