const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
// const expressHbs = require('express-handlebars');

const app = express();

// app.engine('hbs', expressHbs({
//     layoutsDir: 'views/layouts',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// }));

app.set('view engine', 'ejs');
// app.set('view engine', 'hbs');
// app.set('view engine', 'pug' ); // setting views for pug
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require('./routes/shop');


const errorControllers = require('./controllers/error')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // for serving path of static files eg. css files

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorControllers.get404);


app.listen(3000);
