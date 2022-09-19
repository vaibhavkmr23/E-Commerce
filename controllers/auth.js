const crypto = require('crypto');

const brcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: 'G'
    }
}));

exports.getLogin = (req, res, next) => {
    let message = (req.flash('error'));
    if (message.length > 0) {
        message = message[0];
    }
    else {
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
    if (message.length > 0) {
        message = message[0];
    }
    else {
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg
        });
    }
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
                    return transporter.sendMail({
                        to: email,
                        from: "vaibhav@hgk.com",
                        subject: 'SignUp succeeded',
                        html: '<h1>You successfully signed up!</h1>'
                    })
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

exports.getReset = (req, res, next) => {
    let message = (req.flash('error'));
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset',
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log("error is::", err);
            return res.redirect('/login')
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', "No Acount found")
                    return res.redirect('/reset')
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save()
            })
            .then(result => {
                transporter.sendMail({
                    to: req.body.email,
                    from: "vaibhav@hgk.com",
                    subject: 'Password Reset',
                    html: ` 
                    <p> You requested a Password Request </p>
                    <p> Click this <a href="http://localhost:3000/reset/${token}"></a>
                    `
                })
            })
            .catch(err => {
                console.log("Error is ::", err)
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    let token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = (req.flash('error'));
            if (message.length > 0) {
                message = message[0];
            }
            else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                passwordToken: token,
                userId: user._id.toString()// need that for Post request where we have to save our new password
            });
        })
        .catch(err => {
            console.log(err);
        })

}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return brcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        }).then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
}