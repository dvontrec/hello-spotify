const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	spotifyId: String,
	name: String
});

module.exports = mongoose.model('User', userSchema);