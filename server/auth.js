// oauth 2.0 functions for server
'use strict'

// modules
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./config');
// our modules
const db = require('./db/interface.js');

passport.serializeUser(function(user, done) {
    done(null, user);
  }
);

passport.deserializeUser(function(user, done) {
    done(null, user);
  }
);

//7070/google/callback
passport.use(new GoogleStrategy({
    clientID: config.oauth.id,
    clientSecret: config.oauth.secret,
    callbackURL: `${config.network.domain}:${config.network.port}/google/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
    // use the profile info to check if the user is in db
    // if no record found then add new user record
    if(!(await db.getUser(profile.id))) {
      db.addUser(profile.id);
    }

    return done(null, profile);
  }
));
