var crypto = require('crypto');
var redis = require('redis');
var _ = require('underscore');

var client = redis.createClient();

var generate_key = function(req, res, next) {
    var out;
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    out = sha.digest('hex');
    req.session.sid = out;
};

var check_session = function(req, res, next) {
    if (!req.session.sid) {
        generate_key(req, res, next);
    }
};

var user = {
    index: function(req, res, next) {
        check_session(req, res, next);
        res.render('index', {});
    },
    home: function(req, res, next) {
        check_session(req, res, next);
        req.session.lastPage = '/home';
        res.send("welcome, " + req.session.user + "!");
    },
    login: function(req, res, next) {
        check_session(req, res, next);
        var body = req.body;
        client.get(body.email, function(err, password) {
            if (body.password == password) {
                req.session.user = body.email;
                res.redirect('/home');
            } else {
                res.redirect('/');
            }
        });
    },
    signup: function(req, res, next) {
        check_session(req, res, next);
        var body = req.body;
        client.set(body.name, body);
        res.redirect('/');
    },
    getVideo: function(req, res, next) {
        console.log(req.body.video_query);
        res.redirect('/');
    }

};

module.exports = user;
