const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');

const mongoose = require("mongoose");

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require('./routes/shop');

const errorControllers = require('./controllers/error');

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // for serving path of static files eg. css files

app.use((req, res, next) => {
    User.findById('631f200ddb3d90b8064e4c78').then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorControllers.get404);

mongoose.connect('mongodb+srv://Vaibhav:23101995@cluster0.gsxn3bf.mongodb.net/shop')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Test',
                    email: 'test@test.com',
                    cart: {
                        items: []
                    }
                })
                user.save();
            }
        });
        app.listen(3000);
        console.log("Connected");
    }).catch(err => {
        console.log(err);
    })