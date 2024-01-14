require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 5000;


const secret = crypto.randomBytes(16).toString('hex');
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: { maxAge: 3600000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

// Connect to Database
connectDB();

// Static Files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

// Handle 404
app.get('*', function(req, res) {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});