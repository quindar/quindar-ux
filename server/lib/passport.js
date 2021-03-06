//passport for Google Login
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User       = require('../models/user');

// load the auth variables
var config = require('../config/config.env.js');
var configAuth = new config();
//load the user roles
var configRole = require('../config/role');

var userRole;

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    try{
        passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL,
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function(req, token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // check if the user is already logged in
                if (!req.user) {

                    User.findOne({ 'google.id' : profile.id }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.google.token) {
                                user.google.token = token;
                                user.google.name  = initCaps(profile.displayName);
                                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                                user.save(function(err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user);
                        } else {
                            var newUser          = new User();

                            newUser.google.id    = profile.id;
                            newUser.google.token = token;
                            newUser.google.name  = initCaps(profile.displayName);
                            newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            newUser.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user               = req.user; // pull the user out of the session

                    user.google.id    = profile.id;
                    user.google.token = token;
                    user.google.name  = initCaps(profile.displayName);
                    user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                    user.save(function(err) {
                        if (err)
                            return done(err);

                        return done(null, user);
                    });

                }
            });
        }));
    } catch(e){
        console.log("Error creating GoogleStrategy " + e);
    }
};

//capitalise first letter of each word
function initCaps(str){
    words = str.toLowerCase().split(' ');

     for(var i = 0; i < words.length; i++) {
          var letters = words[i].split('');
          letters[0] = letters[0].toUpperCase();
          words[i] = letters.join('');
     }
     return words.join(' ');
}
