var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
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

if(!locals.googleApiConfig){
  console.log('[ERROR]', "MISSING: 'sails.config.googleApiConfig'");
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

/////////////////////////
/// Google
/////////////////////////
var googleOptions = {
  clientID: locals.googleApiConfig.clientID,
  clientSecret: locals.googleApiConfig.clientSecret,
  callbackURL: locals.googleApiConfig.callbackURL.replace('{URL}', appUrl),
};

passport.use(new GoogleStrategy(googleOptions, function(accessToken, refreshToken, profile, done) {
    sails.log.silly("Passport.Google: Found profile", {profile: profile});
    
    if(!profile.emails || profile.length == 0){
      var err = 'Passport.Google: Email Missing';
      sails.log.error(err);
      return done(err);
    }
    
    var findParam = {
      googleId: profile.id
    };
    
    var createParam = {
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
    };
    
    User.findOrCreate(findParam, createParam, function(err, user) {
      if (err) {
        sails.log.error('Passport.Google', err);
        return done(err);
      }
      
      user.googleAccessToken = refreshToken ? refreshToken : accessToken;
      user.save(function(err, usr) {
        if(err){
          sails.log.error('Passport.Google: Saving User Model', err);
          return done(err);
        }
        
        sails.log.verbose('Passport.Google: Updating UserID', usr);
        return done(null, user, { message: '(Google) Logged In Successfully' });
      });
    });
  }
));