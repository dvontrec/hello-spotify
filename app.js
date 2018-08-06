require('dotenv').config();
const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('./models/User');
const port = process.env.PORT;
const app = express();

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(
	new SpotifyStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: 'http://localhost:3005/auth/spotify/callback'
		},
		function(accessToken, refreshToken, expires_in, profile, next) {
			console.log(profile);
			User.findOrCreate(
				{ spotifyId: profile.id, name: profile.displayName },
				(err, user) => {
					console.log('CREATING user: ', user);
					return next(err, user);
				}
			);
		}
	)
);

app.use('/', require('./routes/index'));
app.get('/auth/spotify', passport.authenticate('spotify'), function(req, res) {
	// The request will be redirected to spotify for authentication, so this
	// function will not be called.
});
app.get(
	'/auth/spotify/callback',
	passport.authenticate('spotify', { failureRedirect: '/login' }),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/spot');
	}
);

app.listen(port, () => {
	console.log('Your app is running on port ', port);
});
