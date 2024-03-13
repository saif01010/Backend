
import { Strategy as GoogleStrategy } from 'passport-google-oidc';
import { GoogleUser } from '../models/googleUser.model.js';
import passport from 'passport';
import { Router } from 'express';

 passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.redirect_uri_mismatch
}), async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await GoogleUser.findOne({ email: profile.emails[0]?.value || profile.email });
        if (user) {
            return done(null, user);
        }
        const newUser = await GoogleUser.create({
            displayName: profile.displayName,
            email: profile.emails[0]?.value|| profile.email,
            picture: profile.photos[0]?.value|| profile.picture,
        });
        done(null, newUser);
    }
    catch (error) {
        done(error, false);
    }
});



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


const router = Router();

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));


router.get('/oauth2/redirect/google', passport.authenticate('google', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login'
      }));

export default router;