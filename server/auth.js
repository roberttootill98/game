// oauth 2.0 functions for server
'use strict'

// id: 636085848325-57j3ht8mh47a371j8u0fqaajjlup8ckk.apps.googleusercontent.com
// secret: OMbPznTAiln2q4dlQbPSsT8i

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
  }
);

passport.deserializeUser(function(user, done) {
    done(null, user);
  }
);

passport.use(new GoogleStrategy({
    clientID: '636085848325-57j3ht8mh47a371j8u0fqaajjlup8ckk.apps.googleusercontent.com',
    clientSecret: 'OMbPznTAiln2q4dlQbPSsT8i',
    callbackURL: "http://localhost:80/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // use the profile info to check if the user is in db
    // if not in add new record
    // or load existing
    return done(null, profile);
  }
));
