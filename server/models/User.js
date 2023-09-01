const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
	name: {
		type: String,
		min: 8,
		max: 64
	},
	email: {
		type: String,
		min: 8,
		max: 64,
		unique: true
	},
	password: {
		type: String,
		min: 8,
		max: 64
	}
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
