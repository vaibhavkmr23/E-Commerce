exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1] === true;
    console.log(req.session.isLoggedIn);
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
        res.redirect('/');
    }).catch(err => console.log(err));

};

exports.postLogin = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect("/");
    })
};