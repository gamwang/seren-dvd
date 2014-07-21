var redis = require('redis');
var _ = require('underscore');

var client = redis.createClient();

var crypto = require('crypto');
var generate_key = function(req, res, next) {
    var out;
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    out = sha.digest('hex');
    req.session.sid = out[0];
    for (var i = 1; i < 20; i += 1) {
        req.session.sid += out[i];
    }
};

var check_session = function(req, res, next) {
    if (!req.session.sid) {
        generate_key(req, res, next);
    }
    // console.log("user session id: " + req.session.sid);
    // console.log("user session Information: " + JSON.stringify(req.session));
};

var user = {
    index: function(req, res, next) {
        check_session(req, res, next);
        console.log("SESSION:" + JSON.stringify(req.session));
        res.render('index', {
            name: req.session.user
        });
    },
    home: function(req, res, next) {
        check_session(req, res, next);
        var show = 'Not Logged In';
        if (req.session.user) {
            show = req.session.user;
        }
        res.render('index', {
            name: show
        });
    },
    login: function(req, res, next) {
        check_session(req, res, next);
        var body = req.body;
        client.hget('users', body.email, function(err, data) {
            data = JSON.parse(data);
            if (_.isNull(data) || body.password != data.psswrd) {
                res.redirect('/');
            } else {
                req.session.user = data.frstnme + ' ' + data.lstnme;
                res.redirect('/home');
            }
        });
    },
    logout: function(req, res, next) {
        delete req.session.user
        res.redirect('/')
    },
    signup: function(req, res, next) {
        check_session(req, res, next);
        var body = req.body;
        client.hset('users', body.email, JSON.stringify(body));
        res.redirect('/');
    },
    getVideo: function(req, res, next) {
        console.log(req.body.video_query);
        res.redirect('/');
    }

};

module.exports = user;
