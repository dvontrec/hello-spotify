require('dotenv').config();
const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const port = process.env.PORT;
const app = express();

passport.use(
	new SpotifyStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: 'http://localhost:3005/auth/spotify/callback'
		},
		function(accessToken, refreshToken, expires_in, profile, next) {
			User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
				return next(err, user);
			});
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
