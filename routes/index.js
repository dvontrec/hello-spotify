const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('route connected');
});

router.get('/spot', (req, res) => {
	res.send('BINGO!!!!');
});

router.get('/wrong', (req, res) => {
	res.send('Cannot login');
});

module.exports = router;
