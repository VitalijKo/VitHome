const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlaceSchema = new Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	title: {
		type: String,
		min: 8,
		max: 64
	},
	address: {
		type: String,
		min: 8,
		max: 128
	},
	description: {
		type: String,
		min: 64,
		max: 1024
	},
	photos: {
		type: [String],
		max: 10
	},
	benefits: {
		type: [String],
		max: 10
	},
	extra: {
		type: String,
		max: 32
	},
	checkIn: {
		type: Number
	},
	checkOut: {
		type: Number
	},
	maxGuests: {
		type: Number
	},
	price: {
		type: Number
	}
});

const PlaceModel = mongoose.model('Place', PlaceSchema);

module.exports = PlaceModel;
