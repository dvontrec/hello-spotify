require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const port = process.env.PORT;
const app = express();

require('./services/passport');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000, //saves the cookie for 30 days 24 hours in a day 60 minutes in an hour 60 seconds in a minute 1000 milliseconds in a second
		// encrypts the cookie
		keys: [process.env.COOKIE_KEY_1]
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index'));
app.get(
	'/auth/spotify',
	passport.authenticate('spotify', {
		scope: [
			'streaming',
			'user-read-birthdate',
			'user-read-email',
			'user-read-private'
		],
		showDialog: true
	}),
	(req, res) => {
		// The request will be redirected to spotify for authentication, so this
		// function will not be called.
	}
);
app.get(
	'/auth/spotify/callback',
	passport.authenticate('spotify', { failureRedirect: '/wrong' }),
	(req, res) => {
		console.log('help');
		// Successful authentication, redirect home.
		res.redirect('/current_user');
	}
);

app.listen(port, () => {
	console.log('Your app is running on port ', port);
});
