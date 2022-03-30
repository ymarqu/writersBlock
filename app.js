const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const promptRouter = require('./router/promptRouter');
const registerRouter = require('./router/registerRouter')
const ExpressError = require('./utils/expressError');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const app = express();

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname + '/public')));


app.use(session({
    secret: "Thisisthescret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/journals', promptRouter);
app.use('/', registerRouter);



const run = async() => {
    mongoose.connect('mongodb://localhost:27017/journalsDB');
    console.log("DB connected");    
} 
run().catch(e => {console.log(e)});



app.get('/', (req, res) => {
    res.render('home');
});

app.all('*',(req, res, next) => {
    next(new ExpressError('Page not found', 404));
});


app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong"

    res.status(statusCode).render('error', {err});
});



app.listen(3000, () => {
    console.log('listening on port 3000');
})