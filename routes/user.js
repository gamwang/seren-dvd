var redis = require('redis');
var _ = require('underscore');
var request = require('request');

var client = redis.createClient();
var crypto = require('crypto');

var ip_cache = {};

// var generate_key = function(req, res, next) {
//     var sha = crypto.createHash('sha256');
//     var out;
//     sha.update(Math.random().toString());
//     out = sha.digest('hex');
//     req.session.sid = out[0];
//     for (var i = 1; i < 20; i += 1) {
//         req.headers.cookie.sid += out[i];
//     }
// };

// var check_session = function(req, res, next) {
//     if (!req.session.sid) {
//         generate_key(req, res, next);
//     }
//     // console.log("user session id: " + req.session.sid);
//     // console.log("user session Information: " + JSON.stringify(req.session));
// };

// var store_location = function(req, res, next) {
//     var ip = req.headers['x-real-ip']
//     request('http://freegeoip.net/json/' + ip, function(err, res, body) {
//         try {
//             countryName = JSON.parse(body).country_name.toString();
//             console.log(countryName);
//         } catch (e) {
//             console.log(e);
//         }
//     });
// }

var user = {
    index: function(req, res, next) {
        var ip = req.headers['x-real-ip'];
        var time = new Date().getTime();
        var info = {
            ip: ip || 'none',
            ms: time
        }
        client.hset('browser_sessions:' + req.sessionID, time, JSON.stringify(info));

        var name = null
        if (req.user) {
            name = req.user.frstnme
        }
        res.render('index', {
            name: name
        });
    },
    home: function(req, res, next) {
        var show = null;
        if (req.user) {
            show = req.user.frstnme;
        }
        res.render('index', {
            name: show
        });
    },
    signup: function(req, res, next) {
        var sha = crypto.createHash('sha256');
        var body = req.body;
        sha.update(body.psswrd.toString());
        body.psswrd = sha.digest('hex');
        body.email = body.email.toLowerCase();
        client.hget('users', body.email, function(err, data) {
            data = JSON.parse(data);
            if (_.isNull(data)) {
                client.hset('users', body.email, JSON.stringify(body));
                res.redirect('/');
            } else {
                res.redirect('/signupFail');
            }
        });
    },
    signupFail: function(req, res, next) {
        res.render('error', {
            msg: 'Email already exists in the Database! Try a different one!'
        });
    },
    loginFail: function(req, res, next) {
        res.render('error', {
            msg: 'wrong login information!'
        });
    },
    getVideo: function(req, res, next) {
        console.log(req.body.video_query);
        res.redirect('/');
    }

};

module.exports = user;
