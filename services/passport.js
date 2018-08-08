require('dotenv').config();

const passport = require('passport');
const mongoose = require('mongoose');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../models/User');

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
			const existingUser = await User.findOne({ spotifyId: profile.id });
			if (existingUser) {
				console.log('Returning user');
				return done(null, existingUser);
			}
			console.log('new user');
			const user = await new User({
				name: profile.displayName,
				profilePic: profile.photos[0],
				spotifyId: profile.id,
				accessToken: accessToken,
				refreshToken: refreshToken
			}).save();
			done(null, user);
		}
	)
);
