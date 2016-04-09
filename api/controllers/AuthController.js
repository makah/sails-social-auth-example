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
            req.flash('error', msg);
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
    },

    resetPassword: function(req, res) {
        sails.log.info('AuthController.resetPassword: ', 'Params', req.params);
        var msg = '';

        if (req.params.token === undefined) {
            msg = "Missing parameter 'token'";
            sails.log.error('AuthController.resetPassword: ', msg);
            req.flash('error', msg);
            return res.end();
        }

        var findParam = {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {'>': Date.now()}
        };

        User.findOne(findParam, function(err, user) {
            if (!user) {
                msg = 'Password reset token is invalid or has expired.';
                sails.log.error(msg);
                req.flash('error', msg);
                return res.redirect('/');
            }
            res.render('static/resetPassword', {user: user});
        });
    },

    updatePassword: function(req, res) {
        var params = req.params.all();
        sails.log.info('AuthController.updatePassword: ', 'Params', params);
        var msg = '';

        if(params.password != params.confirm){
            msg = 'Password is different from Confirm Password.';
            req.flash('error', msg);
            sails.log.error('AuthController.updatePassword: ', msg);
            return res.send(msg);
        }

        async.waterfall([
            function(callback) {
                var findParam = {
                    resetPasswordToken: params.token,
                    resetPasswordExpires: {'>': Date.now()}
                };
                
                sails.log.silly(findParam);

                User.findOne(findParam, function(err, user) {
                    if (!user) {
                        msg = 'Password reset token is invalid or has expired.';
                        req.flash('error', msg);
                        sails.log.error('AuthController.updatePassword: ', msg);
                        return res.redirect('back');
                    }

                    user.password = params.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            callback(err, user);
                        });
                    });
                });
            },
            function(user, callback) {
                var data = {
                    name: user.name,
                    email: user.email
                };

                var options = {
                    to: user.email,
                    subject: 'Your password has been changed'
                };

                sails.log.info('AuthController.updatePassword: ', data, options);
                sails.hooks.email.send("changedPassword", data, options, function(err) {
                    if (err) return callback(err);

                    msg = 'A notification e-mail has been sent to ' + user.email + '.';
                    sails.log.verbose('AuthController.updatePassword(): ', msg);
                    req.flash('success', msg);
                    return callback(null, 'done');
                });
            }
        ], function(err) {
            res.redirect('/');
        });
    },
};
