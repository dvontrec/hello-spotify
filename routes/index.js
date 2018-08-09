const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi();
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
	if (!req.user) {
		return res.redirect('/auth/spotify');
	}
	res.render('spotify-test');
});

router.get('/spot/:song', (req, res) => {
	if (!req.user) {
		res.redirect('/auth/spotify');
	}
	spotifyApi.setAccessToken(req.user.accessToken);
	spotifyApi.play(
		{
			uris: [req.params.song]
		},
		(err, resp) => {
			if (err) {
				console.log(err);
			}
			res.redirect('back');
		}
	);
});

router.get(
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
router.get(
	'/auth/spotify/callback',
	passport.authenticate('spotify', { failureRedirect: '/wrong' }),
	(req, res) => {
		// Successful authentication, redirect home.
		res.redirect('/');
	}
);

router.get('/wrong', (req, res) => {
	res.send('Cannot login bro');
});

router.get('/current_user', (req, res) => {
	res.send(req.user);
});

module.exports = router;
