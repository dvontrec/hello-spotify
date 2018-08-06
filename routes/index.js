const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('route connected');
});

router.get('/spot', (req, res) => {
	res.send('BINGO!!!!');
});

module.exports = router;
