const User = require("../models/user");


module.exports.renderRegister = (req, res) =>{
    res.render('users/register')
}

module.exports.register = async (req, res, next) =>{
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        // User.register(), this static function is automaticly added to User model thanks to UserSchema.plugin(passportLocalMongoose); (check user model)
        const registerUser = await User.register(user, password);
        //first of all, without calling req.login(), when you register, you will not be sign in, you would register, and then you would also need to sign in
        //second, unfortunately req.login() cannot use await keyword before, but we need to pass callback in parameters to tell what should we do next (in docs)
        req.login(registerUser, err =>{
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
    }catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) =>{
    res.render('users/login');
}

module.exports.login = (req, res) =>{
    req.flash('success', 'Welcome back!');
    //here we accessing req.session.returnTo that we set in middleware.js (check it!), and OR statement is here because there is a change that we clicked just Login button so req.session.returnTo is undefined
    const redirectUrl = req.session.returnTo || '/campgrounds';
    //here we are deleting returnTo object from session, because we signed in and were redirected eather to campgrounds or page that we wanted to access but we needed to be signed in
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) =>{
    //unfortunately req.logout() cannot use await keyword before, but we need to pass callback in parameters to tell what should we do next (in docs)
    req.logout(err =>{
        if (err) return next(err);
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}