const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');

dotenv.config({ path: './even.env' });

app.use(cookieParser())

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


const db = mongoose.connection

db.on('error', (error) => {
    console.log(error)
})
db.once('open', () => {
    console.log('MongoDB連線成功')
})

const User = require('./models/users')

const session = require('express-session');

const deleteuser = async () => {
    const notverifyuser = await User.findOne({ registerboolen: false }) || null;
    const registerexpire = notverifyuser !== null ? notverifyuser.registerexpire : null;
    const registerboolen = notverifyuser !== null ? notverifyuser.registerboolen : null;
    
    if (notverifyuser === null) {
        return;
    }
    if (Date.now() > registerexpire && registerboolen === false) {
        await User.deleteOne({ registerboolen: false });
    } else {
        return;
    }
}

setInterval(deleteuser, 1000); 




app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: true
}))



app.set('view engine', 'hbs')

app.use(express.static('public'))

app.use('/auth', express.static('public'))

app.use(express.urlencoded({ extended: false }));

app.use('/', require('./router/pages'))

app.use('/auth', require('./router/auth'))




app.listen(port, () => {
    console.log(`網址運行為 http://localhost:${port}`)
});



