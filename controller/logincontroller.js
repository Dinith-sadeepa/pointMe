const express = require('express');
const bodyParser = require('body-parser');
const repo = require('../repo/admin_repo');
const subscriberRepo = require('../repo/subcriber_repo');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

/*
    declaring the router
*/
let router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/**
 * intialize cookie-parser to alows us to access browser cookies
 */
router.use(cookieParser());

/**
 * initialize express session to allows us to track user login
 */
router.use(session({
    key: 'admin',
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 500000
    }
}));

/**
 * to check the user's cookies still in the browser cookies
 */

router.use((req, res, next) => {
    if (req.cookies.admin && !req.session.user) {
        res.clearCookie('admin');
    }
    next();
});

/**
 * to check the user logged in
 */
let sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.admin) {
        res.redirect('/admin');
    } else {
        next();
    }
}

/**
 * route for admin panel
 */
router.get('/admin', function (req, res) {
    let count = subscriberRepo.getAllSubscribers();
    count.then(function (result) {
        if (req.session.user && req.cookies.admin) {
            res.render('admin.ejs', { count: result[0].dataValues.count });
        } else {
            res.redirect('/admin/login');
        }
    });


});

/**
 * to check the object is empty
 */
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

/**
 * In there route function can add many routing to same endpoint
 */

router.route('/admin/login')

    /**
     * this is used to browser to render the page..
     * so the browser send GET method
     */
    .get(sessionChecker, (req, res) => {
        // res.sendFile(path.join(__dirname, '/../views/login.ejs'));
        res.render('login.ejs');
    })

    /**
     * this is used to when form submit button clicked this will bring the body data
     */
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        // repo.searchAdmin(username,password).then(function (admin){
        //     if(!admin){
        //         res.redirect('/admin/login');
        //     }else{
        //         req.session.user = admin.dataValues;
        //         res.redirect('/admin');
        //     }
        // });

        let admin = repo.searchAdmin(username, password);
        admin.then(function (result) {
            // console.log(result[0].dataValues);
            if (isEmpty(result)) {
                res.redirect('/admin/login');
            } else {
                req.session.user = result[0].dataValues;
                res.redirect('/admin');
            }
        });
    });

module.exports = router;