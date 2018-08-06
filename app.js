require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use('/', require('./routes/index'));

app.listen(port, () => {
	console.log('Your app is running on port ', port);
});
