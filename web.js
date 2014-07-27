var express = require('express');
var $ = require('jquery');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var redis = require('redis');
var socket = require('socket.io');
var passportSocketIo = require("passport.socketio");
var cookie = require("cookie");
var connect = require('connect');
var crypto = require('crypto');
var _ = require('underscore');
var RedisStore = require('connect-redis')(session);

var user = require('./routes/user');

var sessionStore = new RedisStore;

var app = express();
var http = require('http').Server(app);

var client = redis.createClient();
// passport authentication
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

// In order to track of req's body. ;)
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
// For file uploads TODO(JONBAI): Implement something using this; looks useful.
app.use(multer({
    dest: './uploads/'
}));

// In order to track sessions and cookies
app.use(cookieParser());
app.use(session({
    key: 'connect.sid',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'JBai23',
    store: sessionStore
}));

//for passport.js authentication
app.use(passport.initialize());
app.use(passport.session());

//setup views and path
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');


//Routes
app.get('/', user.index);
app.get('/home', user.home);
app.get('/signupFail', user.signupFail);
app.get('/loginFail', user.loginFail);
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginFail'
}));
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.post('/signup', user.signup);
app.post('/getVideo', user.getVideo);


//Chat Service
var io = socket(http);

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'connect.sid',
    secret: 'JBai23',
    store: sessionStore,
    success: function onAuthorizeSuccess(data, accept) {
        console.log('successful connection to socket.io');
        // The accept-callback still     allows us to decide whether to
        // accept the connection or not.
        accept(null, true);
    },
    fail: function onAuthorizeFail(data, message, error, accept) {
        if (error)
            throw new Error(message);
        console.log('failed connection to socket.io:', message);
        // We use this callback to log all of our failed connections.
        accept(null, false);
    }
}));

io.on('connection', function(socket) {
    var req = socket.conn.request;
    socket.on('chat message', function(msg) {
        io.emit('chat message', req.user.frstnme + ": " + msg);
    });
});

var server = http.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
