const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');

const mongoose = require("mongoose");
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URI = 'mongodb+srv://Vaibhav:23101995@cluster0.gsxn3bf.mongodb.net/shop';


const app = express();
const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorControllers = require('./controllers/error');

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // for serving path of static files eg. css files
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));

// csrf Protection after initialization of sessions
app.use(csrfProtection);

// connect-flash after session initialisation
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            // console.log(err)
            throw new Error(err);
        });
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorControllers.get500);

app.use(errorControllers.get404);

app.use((error, req, res, next)=>{
    // res.status(error.httpStatusCode).render(...)
    res.redirect('/500');
})

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(3000);
        console.log("Connected");
    }).catch(err => {
        console.log(err);
    })