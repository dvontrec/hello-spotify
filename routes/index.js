const express = require('express');
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();
const router = express.Router();

router.get('/', (req, res) => {
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

router.get('/wrong', (req, res) => {
	res.send('Cannot login bro');
});

router.get('/current_user', (req, res) => {
	res.send(req.user);
});

module.exports = router;
