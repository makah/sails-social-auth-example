var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcrypt');

/////////////////////////
/// Initialize
///////////////////////// 
var locals = require('./local');
var appUrl = process.env.APP_URL || 'localhost:1337';

if(typeof locals === 'undefined'){
  console.log('[ERROR]', "config/local.js not found.");
  return;
}

/////////////////////////
/// CORE
/////////////////////////
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ id: id } , function (err, user) {
    if (err)
      sails.log.error('passport.deserializeUser: ', 'ID', id);

    done(err, user);
    });
});

/////////////////////////
/// Local
/////////////////////////
var localOptions = {
  usernameField: 'email',
  passwordField: 'password'
};

passport.use(new LocalStrategy(localOptions, function(email, password, done) {
  
  User.findOne({ email: email }, function (err, user) {
      if (err) {
          return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, { message: 'Invalid Password' });
          var returnUser = {
            email: user.email,
            createdAt: user.createdAt,
            id: user.id
          };
          return done(null, returnUser, { message: 'Logged In Successfully' });
        });
    });
  }
));
