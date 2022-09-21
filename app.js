const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');

const mongoose = require("mongoose");
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const MONGODB_URI = 'mongodb+srv://Vaibhav:23101995@cluster0.gsxn3bf.mongodb.net/shop';


const app = express();
const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'Images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorControllers = require('./controllers/error');

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public'))); // for serving path of static files eg. css files
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));

// csrf Protection after initialization of sessions
app.use(csrfProtection);

// connect-flash after session initialisation
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    // throw new Error('Sync Dummy');  // A sync error is caught by express error middleware
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            // throw new Error('Sync Dummy');
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            // console.log(err)
            // throw new Error(err);
            next(new Error(err)); // for async or  for callback and promises always use this
        });
});




app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorControllers.get500);

app.use(errorControllers.get404);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...)
    // res.redirect('/500');

    // rendering error page for  geting stuck in infinite loop to show error outside callback and promises
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
})

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(3000);
        console.log("Connected");
    }).catch(err => {
        console.log(err);
    })