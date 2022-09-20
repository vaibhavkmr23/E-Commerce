const express = require('express');

const { check, body } = require('express-validator/check');

const User = require('../models/user')

const router = express.Router();

const authController = require("../controllers/auth");

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup)

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage("Please Enter a Valid Email!!")
        .normalizeEmail(),// Sanitization making small letters, removing white spaces ets
    body('password', "Please enter password of 5 alphanumeric Charecters")
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()//Sanitizing data removing white Spaces
], authController.postLogin);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please Enter valid email.')
            .custom((value, { req }) => { // Adding Custom Validation
                // if (value === 'test@test.com') {
                //     throw new Error("This Email is Forbidden.");
                // }
                // return true;
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('E-Mail exists already, please Pick A new One');
                        }
                    })
            })
            .normalizeEmail(),// sanitization
        body('password',
            'Please Enter password with only numbers and text and at least 5 charecters'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })
        .trim()
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;