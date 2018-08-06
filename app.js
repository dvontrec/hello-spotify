const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send('up and running');
});

app.listen(3000, () => {
	console.log('Your app is running');
});
