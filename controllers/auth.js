const brcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    let message = (req.flash('error'));
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
    let message = (req.flash('error'));
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password
    User.findOne({ email: email }).then(user => {
        if (!user) {
            req.flash('error', 'invalid Email or Password');
            return res.redirect('/login');
        }
        brcrypt.compare(password, user.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    return req.session.save(err => {
                        // if (err) {
                        //     console.log(err);
                        // } else {
                        console.log("Error is::", err);
                        return res.redirect('/');
                        // }
                    })
                }
                req.flash('error', 'invalid Email or Password');
                res.redirect('/login')
            })
    })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'E-Mail exists already, please Pick A new One');
                return res.redirect('/signup');
            }
            return brcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    })
                    return user.save()
                })
                .then(result => {
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect("/");
    })
};