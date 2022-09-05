const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require('./routes/shop');

const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');


const errorControllers = require('./controllers/error')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // for serving path of static files eg. css files

app.use((req, res, next) =>{
    User.findByPk(1).then(user =>{
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorControllers.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
        // console.log(result);
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name : 'Max', email: 'test@test.com'});
        }
        return user;
    })
    .then(user => {
        console.log(user);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });




