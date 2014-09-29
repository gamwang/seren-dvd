var crypto = require('crypto');
var redis = require('redis');
var client = redis.createClient();
var _ = require('underscore');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        var sha = crypto.createHash('sha256');
        sha.update(password.toString());
        var cmp_psswrd = sha.digest('hex');
        email = email.toLowerCase();
        client.hget('users', email, function(err, data) {
            data = JSON.parse(data);
            if (_.isNull(data)) { // if user name does not exist
                return done(null, false, {
                    msg: 'Incorrect username.'
                });
            } else if (cmp_psswrd != data.psswrd) { // if passwrod does not match
                return done(null, false, {
                    msg: 'Incorrect password.'
                });
            } else { // success login
                done(null, data);
            }
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;
