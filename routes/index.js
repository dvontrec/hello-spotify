const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('route connected');
});

router.get('/spot', (req, res) => {
	const path = '../views/text.html';
	res.sendFile(path);
});

router.get('/wrong', (req, res) => {
	res.send('Cannot login bro');
});

router.get('/current_user', (req, res) => {
	res.send(req.user);
});

module.exports = router;
