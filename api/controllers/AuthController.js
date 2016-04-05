/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');
var crypto = require('crypto');

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    login: function(req, res) {
        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }
            req.logIn(user, function(err) {
                if (err)
                    return res.send(err);

                return res.redirect('/private');
            });

        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    },

    sendTokenMail: function(req, res) {
        var params = req.params.all();
        sails.log.info('AuthController.sendTokenMail: ', 'Params', params);
        var msg = '';

        if (params.email === undefined) {
            msg = "Missing parameter 'email'";
            sails.log.error('AuthController.sendTokenMail: ', msg);
            req.flash(msg);
            return res.redirect('/forgotPassword');
        }

        async.waterfall([
            function(callback) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    callback(err, token);
                });
            },
            function(token, callback) {
                User.findOne({email: params.email}, function(err, user) {
                    if (!user) {
                        msg = 'No account with that email address exists.';
                        req.flash('error', msg);
                        sails.log.error('AuthController.sendTokenMail: ', err, msg);
                        return callback(err);
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + (60 * 60 * 1000);
                    user.save(function(err) {
                        return callback(err, token, user);
                    });
                });
            },
            function(token, user, callback) {
                var data = {
                    recipientName: user.name,
                    senderMail: user.email,
                    siteName: sails.config.siteName,
                    siteAddrs: sails.config.appUrl,
                    token: token
                };

                var options = {
                    to: user.email,
                    subject: sails.config.siteName + ": Forgot Password"
                };

                sails.log.info('AuthController.sendTokenMail: ', data, options);
                sails.hooks.email.send("forgotPassword", data, options, function(err) {
                    if (err) return callback(err);
                    
                    msg = 'An e-mail has been sent to ' + user.email + ' with further instructions.';
                    sails.log.verbose('AuthController.sendTokenMail(): ', msg);
                    req.flash('success', msg);
                    return callback(null, 'done');
                });
            }
        ], function(err) {
            if (err){
                sails.log.verbose('AuthController.sendTokenMail [Waterfall.finally]: ', err);
                req.flash('error', 'Error trying to send you email.');
                return res.redirect('/forgotPassword');
            }
            
            return res.redirect('/');
        });
    }

};
