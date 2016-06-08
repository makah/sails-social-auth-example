# Sails.js Social Authentication Example

Learning SailsJS using PassportJS.

#### Phase 1 ####
1. Create project in [Cloud9](https://c9.io/)
2. Create project sails-social-auth-example using [Sails](http://sailsjs.org/get-started)
3. First Commit

#### Fase 2 ####
1. Install [Passport](http://passportjs.org/) using [Giancarlo Soverini](http://iliketomatoes.com/implement-passport-js-authentication-with-sails-js-0-10-2/) tutorial - [commit](https://github.com/makah/sails-social-auth-example/commit/811912dec01ab3d58142e4dceea6f2601c7e91d1)
2. Create a private area that only logged user could enter (with logout function) - [commit](https://github.com/makah/sails-social-auth-example/commit/9b9776ffe9d5f435647e09589510385f252e3140)
3. Create a flash message alerting users when they are not logged - [commit](https://github.com/makah/sails-social-auth-example/commit/a0b22f3d9b5415256fa7ee312c23db7a57093548)
    1. Info: O Chrome sends two POST. I did an workaround that sends only one message
    2. Info: In the future I will use AngularJS and receive messages via JSON, so I don't need a complex use of flash() messages 
    3. I could've use ['FlashService' + 'flash' policy](http://stackoverflow.com/a/25352340/205034), but It is too complex for my use right now
    4. Using this [ideia](http://stackoverflow.com/a/28621678/205034) for a simple req.flash(). Create a partial EJS to handle flash messages in client side
4. Study: Send encrypted password (client -> server)
    1. It's not a good idea. The default is plain text + HTTPS
    2. [Explanation¹](http://stackoverflow.com/a/4121657)
    3. [Javascript Cryptography](https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/august/javascript-cryptography-considered-harmful/)
5. Forgot password
    1. Steps: (User ask to reset password via /forgotPassword) -> (Server sends an email) -> (User define a new password using token received  in email) -> (Server update password and discard token). Used tutorial writen by [Sahat Yalkabov](http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/)
    2. Allow Sails to send email via [sails-hook-email](https://github.com/balderdashy/sails-hook-email) (it's hard to configure) - [commit](https://github.com/makah/sails-social-auth-example/commit/1122dfcaa40f6c376a31d0b5d9170204f407a59e)
    3. Allow password reset and verify token expiration - [commit](https://github.com/makah/sails-social-auth-example/commit/544edb6723d20cc22c73569faf6cf8fa505928bd)
6. Google Login [commit](https://github.com/makah/sails-social-auth-example/commit/49545f87d0a0bba14649ad7661c221e53e4454b4)
    1. Follow [Google API](https://console.developers.google.com) steps - [Tutorial do Jenkins](https://wiki.jenkins-ci.org/display/JENKINS/Google+Login+Plugin)
    2. Implement Google Auth via [passport-google-oauth](http://passportjs.org/docs/google) follow tutorial written by [sails-social-auth-example](https://github.com/stefanbuck/sails-social-auth-example/blob/master/config/express.js) and [Michael Herman](http://mherman.org/blog/2013/11/10/social-authentication-with-passport-dot-js/#.VxUt8_krKCh)
    3. Note that we don't need to use google/callback - [FIX](https://github.com/stefanbuck/sails-social-auth-example/issues/10)
    4. This [Stackoverflow's question](http://stackoverflow.com/questions/11485271/google-oauth-2-authorization-error-redirect-uri-mismatch) could help.

