const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	place: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Place',
		required: true
	},
	checkIn: {
		type: Date,
		required: true
	},
	checkOut: {
		type: Date,
		required: true
	},
	guestsNumber: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	}
});

const BookModel = mongoose.model('Book', BookSchema);

module.exports = BookModel;
