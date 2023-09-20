const express = require('express');
const session = require('express-session');
const User = require('../models/users')
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index2')
});



router.get('/index3', (req, res) => {
    res.render('index3')
});

router.get('/index4', (req, res) => {
    res.render('index4')
});

const checkAuth = (req, res, next) => {
    const hasaccount = req.session.reqemail && req.session.reqpassword;
    if (hasaccount) {
        next();
    } else {
        res.redirect('/index3');
    }
}

router.get('/index5', checkAuth, async (req, res) => {
    const recordname = req.session.reqname;
    const recordemail = req.session.reqemail;
    const recordpassword = req.session.reqpassword;
    const recordtime = req.session.reqtime;


    const token = req.cookies.jwt;

    if (!token) {
        console.log('no token');
        return res.redirect('/index3');
    }

    const userid = req.query.userid;

    const hasuser = await User.findOne({ _id: userid });


    if (!hasuser) {

        console.log('no user');
        return res.redirect('/index3');
    }


    const publicKey = hasuser.publicKey;


    jwt.verify(token, publicKey, (err, decodedToken) => {
        if (err) {
            console.log(123);
            return res.redirect('/index3');
        } else {
            res.render('index5', { user: decodedToken , recordname, recordemail, recordpassword, recordtime})
        }
    })

    res.render('index5', { recordname, recordemail, recordpassword, recordtime })
})

router.get('/verifyerror', (req, res) => { 
    res.render('verifyerror')
})

router.get('/verifyregister', (req, res) => { 
    res.render('verifyregister')
})




module.exports = router;
