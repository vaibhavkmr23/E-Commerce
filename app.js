const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');

const app = express();


app.set('view engine', 'ejs');
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
