require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const port = process.env.PORT;
const app = express();

require('./services/passport');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.use(
	cookieSession({
		name: 'Spotify User',
		maxAge: 60 * 60 * 1000, //saves the cookie for 60 minutes in an hour 60 seconds in a minute 1000 milliseconds in a second
		// encrypts the cookie
		keys: [process.env.COOKIE_KEY_1]
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index'));

app.listen(port, () => {
	console.log('Your app is running on port ', port);
});
