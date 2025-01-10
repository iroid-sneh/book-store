require('dotenv').config();
import passport from "passport";
import jwt from 'jsonwebtoken';
import User from "../../models/user";
import { Strategy } from "passport-facebook";

passport.use(new Strategy({
    clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
    clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
    callbackURL: "http://localhost:8001/facebook/callback",
    profileFields: ['id', 'emails', 'name']
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user_emails = profile.emails && profile.emails[0].value;
            s
            let user = await User.findOne({ email: user_emails });
            if (user) {
                user.facebookAccessToken = accessToken;
                await user.save();

                const jwtToken = jwt.sign({ id: user.id },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                return done(null, { user, token: jwtToken });
            } else {
                const newUser = new User({
                    name: `${profile.name.givenName} ${profile.name.familyName}`,
                    email: user_emails,
                    facebookId: profile.id,
                    facebookAccessToken: accessToken
                });
                await newUser.save();

                const jwtToken = jwt.sign({ id: newUser.id },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return done(null, { user: newUser.id, token: jwtToken });
            }

        } catch (error) {
            done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(null, error);
    }
});


export default passport;