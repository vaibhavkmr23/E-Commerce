const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require('./routes/shop');

const errorControllers = require('./controllers/error');
const mongoConnect = require("./utils/database").mongoConnect;

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // for serving path of static files eg. css files

app.use((req, res, next) => {
    User.findById('6318903a1b086de1823927fe').then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    }).catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorControllers.get404);

mongoConnect(() => {
    app.listen(3000);
});
