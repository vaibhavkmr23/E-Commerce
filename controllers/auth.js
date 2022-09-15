const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1] === true;
    console.log(req.session.isLoggedIn,'in login');
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true: HttpOnly');
    User.findById('631f200ddb3d90b8064e4c78').then(user => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        // console.log(req.session,'in post login session');

        req.session.save(err => {
            if(err){
                console.log(err);
            } else {
                res.redirect('/');
            }
        }); 

    }).catch(err => console.log(err));

};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect("/");
    })
};