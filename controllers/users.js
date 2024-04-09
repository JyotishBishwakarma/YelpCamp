
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

module.exports.registerForm= (req,res)=>{
    res.render('users/register')
}

module.exports.register = async(req,res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const  registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            
            req.flash('success','Welcome to campground!');
            res.redirect('/campgrounds');
        })
      }catch(e){
        req.flash('error',e.message);
        console.log('error',e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req,res)=>{
    res.render('users/login')
}

module.exports.login = (req,res)=>{
    req.flash('success','Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
    // res.send(req.body);
}

module.exports.logout = (req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err)
        }
        req.flash('success','GoodBye!');
        res.redirect('/campgrounds')

    });
}