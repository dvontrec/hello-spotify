require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('./models/User');
const port = process.env.PORT;
const app = express();

const mongoURL = process.env.DATABASEURL || 'mongodb://localhost/hello-spotify';

mongoose.connect(mongoURL);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(
	new SpotifyStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: '/auth/spotify/callback'
		},
		async (accessToken, refreshToken, expires_in, profile, done) => {
			console.log(accessToken);
			const existingUser = await User.findOne({ spotifyId: profile.id });
			if (existingUser) {
				console.log('Returning user');
				return done(null, existingUser);
			}
			console.log('new user');
			const user = await new User({ spotifyId: profile.id }).save();
			done(null, user);
		}
	)
);

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
		scope: 'user-read-private user-read-email',
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
