const _user = require('../../models/user')
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
   const user_id = await _user.findById(id);
    done(null,user_id)
})

passport.use('auth-local', new localStrategy({
    usernameField: 'email',
    passwordField: 'pass',
    passReqToCallback: true
},async (req, email, pass, done) =>{
    const validate_user = await _user.findOne({email:email});
    if (validate_user) {
        return done(null,false, req.flash('signUpMessage', 'email exist'));
    }else{
        const user = new _user();
        user.email = email;
        user.pass = user.encryptPass(pass);
        await user.save();
        done(null,user);
    }
}))

passport.use('auth-local2', new localStrategy({
    usernameField: 'email',
    passwordField: 'pass',
    passReqToCallback: true
},async(req, email, pass, done) =>{

    const validate_user = await _user.findOne({email:email});
    if (!validate_user) {
        return done(null,false, req.flash('signInMessage', 'dosent email exist'));
    }
    if (!validate_user.validatepass(pass)) {
        return done(null,false, req.flash('signInMessage', 'incorrect password '));
    }
     
        done(null,validate_user);
    
}))