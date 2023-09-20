const session = require('express-session');

const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config({ path: './even.env' });


const mongoose = require('mongoose');
const User = require('../models/users');
const Shopcart = require('../models/shopcar');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

// 生成密钥对
function generatePiarKey() {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048, // 密钥长度
        publicKeyEncoding: {
            type: 'pkcs1', // 或 'spki'，取决于您的需求
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1', // 或 'pkcs8'，取决于您的需求
            format: 'pem'
        }
    });
}



//註冊
exports.register = async (req, res) => {
    const { name, email, password, passwordconfirm } = req.body;
    if (name == '' | email == '' | password == '' | passwordconfirm == '') {
        return res.render('index4', {
            message: '請輸入完整資料'
        })
    } else if (password != passwordconfirm) {
        return res.render('index4', {
            message: '密碼不一致'
        })
    } else {
        const hasuser = await User.findOne({ email })

        var hashedpassword = await bcrypt.hash(password, 8);
        if (hasuser) {
            return res.render('index4', {
                message: '此信箱已註冊'
            })
        } else {


            const { publicKey, privateKey } = generatePiarKey();

            const newuser = new User({
                name,
                email,
                password: hashedpassword,
                publicKey,
                privateKey,
                registerboolen: false,
                registerexpire: Date.now() + 1 * 60 * 1000,
            })

            const sendregistermail = (email, name, userid, registerboolen, registerexpire) => {
                try {
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: process.env.EMAIL_ACCOUNT,
                            pass: process.env.EMAIL_PASS
                        }
                    })

                    const mailOptions = {
                        from: process.env.EMAIL_ACCOUNT,
                        to: email,
                        subject: '註冊驗證',
                        text: `請點擊連結以完成註冊
                        https://order-qwic.onrender.com/auth/verify?id=${userid}`
                    }/*https://order-qwic.onrender.com/auth/verify?id=${userid}`
                       http://localhost:3000/auth/verify?id=${userid}`*/

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
            }

            await sendregistermail(req.body.email, req.body.name, newuser._id, newuser.registerboolen, newuser.registerexpire);
            await newuser.save();


            res.render('index3', {
                message: '請先完成Gmail驗證'
            })

        }
    }
}

exports.verifyregister = async (req, res) => {
    try {
        const userID = req.query.id;
        const user = await User.findById(userID);

        if (!user) {
            res.redirect('/verifyerror');
            return;
        }

        const registerexpire = user.registerexpire || 0;

        if (Date.now() < registerexpire) {
            await User.findOneAndUpdate({ _id: userID }, { $set: { registerboolen: true } });
            res.redirect('/verifyregister');
        } else {
            console.log(456);
            res.redirect('/verifyerror');
        }
    } catch (error) {
        console.log(error);
    }
}


// 登录
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email == '' || password == '') {
            return res.render('index3', {
                message: '請輸入完整資料'
            });
        }
        const hasUser = await User.findOne({ email });

        if (!hasUser) {
            return res.render('index3', {
                message: '此信箱未註冊'
            });
        }

        if (!hasUser.registerboolen) {
            return res.render('index3', {
                message: '請先完成Gmail驗證'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, hasUser.password);

        if (!isPasswordCorrect) {
            return res.render('index3', {
                message: '密碼錯誤'
            });
        }

        const name = hasUser.name;
        req.session.reqname = name;
        req.session.reqemail = email;
        req.session.reqpassword = password;

        const payload = {
            name: name,
            email: email,
            publicKey: hasUser.publicKey
        }

        const privateKey = hasUser.privateKey;

        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

        console.log('網路令牌為', token);
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };
        res.cookie('jwt', token, cookieOptions);

        console.log('登入訊息', req.body);
        res.redirect('/index5?userid=' + hasUser._id);
    } catch (error) {
        console.log(error);
    }
};



//登出
exports.logout = (req, res) => {
    req.session.reqname = null;
    req.session.reqemail = null;
    req.session.reqpassword = null;
    res.clearCookie('jwt');
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });

    if (req.session.reqname === null && req.session.reqemail === null && req.session.reqpassword === null) {
        console.log('登出成功');
        return res.redirect('/index3');
    } else {
        // 如果未成功登出，可能需要处理相关错误情况
        console.log('登出失败');
        // 可根据实际情况返回适当的错误页面或重定向
        return res.redirect('/error-page');
    }
};


//點餐
exports.order = async (req, res) => {
    try {
        const name = req.session.reqname;
        const email = req.session.reqemail;

        const omurice = req.body.omuricequantity !== undefined ? req.body.omuricequantity : null;
        const bakedrice = req.body.bakedricequantity !== undefined ? req.body.bakedricequantity : null;
        const melaleuca = req.body.melaleucaquantity !== undefined ? req.body.melaleucaquantity : null;
        const pizza = req.body.pizzaquantity !== undefined ? req.body.pizzaquantity : null;
        const pasta = req.body.pastaquantity !== undefined ? req.body.pastaquantity : null;
        const stew = req.body.stewquantity !== undefined ? req.body.stewquantity : null;

        const omuricecombo = req.body.omuricecomboquantity !== undefined ? req.body.omuricecomboquantity : null;
        const muffin = req.body.muffinquantity !== undefined ? req.body.muffinquantity : null;
        const souffle = req.body.soufflequantity !== undefined ? req.body.soufflequantity : null;
        const cake = req.body.cakequantity !== undefined ? req.body.cakequantity : null;
        const pastacombo = req.body.pastacomboquantity !== undefined ? req.body.pastacomboquantity : null;
        const sundae = req.body.sundaequantity !== undefined ? req.body.sundaequantity : null;

        const blacktea = req.body.blackteaquantity !== undefined ? req.body.blackteaquantity : null;
        const american = req.body.americanquantity !== undefined ? req.body.americanquantity : null;
        const latte = req.body.lattequantity !== undefined ? req.body.lattequantity : null;
        const cappuccino = req.body.cappuccinoquantity !== undefined ? req.body.cappuccinoquantity : null;
        const macchiato = req.body.macchiatoquantity !== undefined ? req.body.macchiatoquantity : null;
        const hotcoco = req.body.hotcocoquantity !== undefined ? req.body.hotcocoquantity : null;

        const honeytoast = req.body.honeytoastquantity !== undefined ? req.body.honeytoastquantity : null;
        const waffledessert = req.body.waffledessertquantity !== undefined ? req.body.waffledessertquantity : null;
        const souffledessert = req.body.souffledessertquantity !== undefined ? req.body.souffledessertquantity : null;
        const frie = req.body.friequantity !== undefined ? req.body.friequantity : null;
        const icecream = req.body.icecreamquantity !== undefined ? req.body.icecreamquantity : null;
        const eggtart = req.body.eggtartquantity !== undefined ? req.body.eggtartquantity : null;







        const lefttime = req.body.time;
        const price = req.body.price;

        // Check if the user is logged in
        if (!name || !email) {
            return res.redirect('/index3'); // Redirect to login page if not logged in
        }

        const hasUser = await User.findOne({ email });

        if (!hasUser) {
            return res.redirect('/index3'); // Redirect to login page if user not found
        }

        // Perform your database operations to add the order
        // For example, using Mongoose:

        // Create a new order
        const newOrder = new Shopcart({
            email,
            omurice,
            bakedrice,
            melaleuca,
            pizza,
            pasta,
            stew,
            price,
            lefttime,
            omuricecombo,
            muffin,
            souffle,
            cake,
            pastacombo,
            sundae,
            blacktea,
            american,
            latte,
            cappuccino,
            macchiato,
            hotcoco,
            honeytoast,
            waffledessert,
            souffledessert,
            frie,
            eggtart,
            icecream,
            finish: 0
        });

        // Save the order
        await newOrder.save();

        // 生成订单的JWT令牌
        const payload = {
            name: name,
            email: email,
            orderId: newOrder._id
        };

        const privateKey = hasUser.privateKey; // 用你的私钥替换此处的字符串
        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
        

        // 将JWT令牌存储在session中，以便在后续请求中使用
        req.session.orderToken = token;


        // Start the countdown and update session variables
        function startCountdown(time, orderId) {
            const countdownInterval = setInterval(async () => {
                time--;

                console.log(time);
                await Shopcart.findByIdAndUpdate(orderId, { $set: { lefttime: time } });

                if (time <= 0) {
                    clearInterval(countdownInterval);
                    console.log('餐點完成');
                    await Shopcart.findByIdAndUpdate(orderId, { $set: { finish: 1 } });
                }
            }, 1000);
        }

        startCountdown(lefttime, newOrder._id); // 为新订单启动倒计时

        req.session.reqtime = lefttime;
        req.session.reqfinish = 0;

        return res.redirect('/index5?userid=' + hasUser._id); // Redirect to order page');
    } catch (error) {
        console.log(error);
        return res.redirect('/error-page'); // 在出现错误时重定向到错误页面
    }
}










