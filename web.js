var express = require('express');
var $ = require('jquery');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var user = require('./routes/user');

var app = express();

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
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));

//setup views and path
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');


//Routes
app.get('/', user.index);
app.get('/home', user.home);
app.post('/login', user.login);
app.post('/signup', user.signup);
app.post('/getVideo', user.getVideo);

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
