const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync (users.register))

router.route('/login')
    .get(users.renderLogin)
    //passport.authenticate() is middleware from passport package
    //first parameter is what strategy to use: local is to autheticate from our DB, others are Twitter, Facebook...
    //second parameter is object and inside you can define for example -> failureFlash, which will provide flash message is failed or failureRedirect -> define to which route(API) to redirect if authentication failed
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', failureMessage: true, keepSessionInfo: true}), users.login);

router.get('/logout', users.logout)

module.exports = router;