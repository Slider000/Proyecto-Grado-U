require('dotenv').config({path: 'src/.env'})
const express = require('express');
const morgan = require('morgan');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const passport = require('passport');
const express_session = require('express-session');
const path = require('path');
const routes = require('./routes/index.routes');
const app = express();

app.set('port', process.env.PORT);
app.set('view engine', engine);
app.set('views', path.join(__dirname,'views'));

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express_session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next)=>{
    app.locals.signUpMessage = req.flash('signUpMessage');
    app.locals.signInMessage = req.flash('signInMessage');
    next();
})
app.use('/public', express.static('public'));
app.use(routes);

module.exports = app;