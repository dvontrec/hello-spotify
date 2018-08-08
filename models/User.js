const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	name: String,
	profilePic: String,
	spotifyId: String,
	accessToken: String,
	refreshToken: String
});

module.exports = mongoose.model('User', userSchema);
