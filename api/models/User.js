/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {
    attributes: {
        name: {
            type: 'string',
            required: true
        },        
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            minLength: 6,
        },

        //Google Signin ID
        googleId: 'string',
        
        //Access token from the Google Authorization Server
        googleAccessToken: 'string',
        
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            delete obj.resetPasswordToken;
            delete obj.resetPasswordExpires;
            
            return obj;
        }
    },
    
    beforeCreate: function(user, cb) {
        if (!user.password && !user.googleId) {
            var err = 'Missing password or single sigon';
            sails.log.error('User.beforeCreate', err);
            return cb(err);
        }
        
        if (user.password) {
            encryptPassword(user, cb);
        }
        else {
            return cb();
        }
    },
    
    beforeUpdate: function(user, cb) {
        if (user.password && user.password.length < 60) {
            encryptPassword(user, cb);
        }
        else {
            return cb();
        }
    }
    
};

function encryptPassword(user, cb) {
    bcrypt.genSalt(9, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                sails.log.error('User.encryptPassword', err);
                return cb(err);
            }
            
            user.password = hash;
            
            return cb();
        });
    });
}