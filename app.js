if (process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET);
//adding comment

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const Review = require('./models/review');
const session =  require('express-session');
const flash =  require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
// const dbUrl = process.env.DB_URL;
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');



const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const secret = process.env.SECRET || 'thisshouldbeabettersecret'

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    // useCreateIndex: true,
    useUnifiedTopology:true
    // useFindAndModify:false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console,"connection error"));
db.once('open',()=>{
    console.log('Database connected');
});

const app = express();

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on('error', function(e){
    console.log("SESSION STORE ERROR",e)
})

const sessionConfig ={
    secret: 'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname,'public')))

app.use(morgan('tiny'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);

app.use(mongoSanitize());

// Or, to replace these prohibited characters with _, use:
// app.use(
//   mongoSanitize({
//     replaceWith: '_',
//   }),
// );




app.get('/',(req,res)=>{
    res.render('home')
})





app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))

})

app.use((err,req,res,next)=>{
    const {statusCode=500} = err;
    if (!err.message) err.message = 'Oh no, Something went wrong!'
    res.status(statusCode).render('error',{err});
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`serving on port ${port}!`)
})