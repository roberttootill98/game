// oauth 2.0 functions for server
'use strict'

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./config');

passport.serializeUser(function(user, done) {
    done(null, user);
  }
);

passport.deserializeUser(function(user, done) {
    done(null, user);
  }
);

console.log;

passport.use(new GoogleStrategy({
    clientID: config.oauth.id,
    clientSecret: config.oauth.secret,
    callbackURL: config.network.domain
  },
  function(accessToken, refreshToken, profile, done) {
    // use the profile info to check if the user is in db
    // if not in add new record
    // or load existing
    return done(null, profile);
  }
));
