
module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    
    //Chrome bug POST same page twice, so I prefer to override the message
    //req.flash('error', 'You are not permitted to perform this action');
    if(!req.session.flash) req.session.flash = {}; 
    req.session.flash.error = ['You are not permitted to perform this action'];
    
    return res.redirect(307, '/');
};