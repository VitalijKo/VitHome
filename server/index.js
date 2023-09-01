const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Place = require('./models/Place');
const Book = require('./models/Book');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const imageDownloader = require('image-downloader');
const { v4: uuidv4 } = require('uuid');
const { differenceInCalendarDays } = require('date-fns');
require('dotenv').config();

const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = 'IWANTAGIRLFRIEND';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'userfiles');
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/:/g, '-');

    cb(null, uuidv4() + '-' + date + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

  if (allowedFileTypes.includes(file.mimetype))
    cb(null, true);
  else {
    cb(null, false);

    return cb(new Error('Only PNG/JPG/JPEG format allowed!'));
  }
};

const limits = {
	fieldNameSize: 50,
	fileSize: 209715200
};

const upload = multer({ storage, fileFilter, limits });

function tokenData(req) {
	return new Promise((resolve, reject) => {
		jwt.verify(req.cookies.token, secret, {}, async (err, data) => {
			err ? reject(null) : resolve(data);
		});
	});
}

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL);

app.use(express.json());

app.use(cookieParser());

app.use('/userfiles', express.static('userfiles'));

app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));

app.get('/places', async (req, res) => {
	const places = await Place.find();

	res.json(places);
});

app.get('/places/:id', async (req, res) => {
	const { id } = req.params;

	const place = await Place.findById(id);

	res.json(place);
});

app.get('/profile', async (req, res) => {
	const data = await tokenData(req);

	if (!data) return res.json(null);

	const { name, email, _id } = await User.findById(data.id);

	res.json({ name, email, _id });
});

app.get('/user-places', async (req, res) => {
	const data = await tokenData(req);

	if (!data) return res.json(null);

	const places = await Place.find({ owner: data.id });

	res.json(places);
});

app.get('/bookings', async (req, res) => {
	const data = await tokenData(req);

	if (!data) return res.json(null);

	const bookings = await Book.find({ user: data.id }).populate('place');

	res.json(bookings);
});

app.post('/signup', async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const user = await User.create({
			name,
			email,
			password: bcrypt.hashSync(password, salt)
		});

		res.json(user);
	} catch(e) {
		res.status(422).json(e);
	}
});

app.post('/login', async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && bcrypt.compareSync(password, user.password)) {
		jwt.sign({ email: user.email, id: user._id }, secret, {}, (err, token) => {
			if (err) throw err;

			res.cookie('token', token).json(user);
		});
	} else
		res.status(422).json('Invalid credentials');
});

app.post('/logout', async (req, res) => {
	res.cookie('token', '').json(true);
});

app.post('/upload-link', async (req, res) => {
	const { link } = req.body;

	const filename = uuidv4() + '-' + new Date().toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/:/g, '-') + '.jpg';

	try {
		await imageDownloader.image({
			url: link,
			dest: __dirname + '/userfiles/' + filename
		});

		res.json(filename);
	} catch(e) {
		res.status(422).json(e);
	}
});

app.post('/upload', async (req, res) => {
	const data = await tokenData(req);

	if (!data) return res.json(null);

	upload.array('photos', 20)(req, res, (err) => {
		if (err)
		  return res.status(422).json({ err });

		const files = [];

		for (let i = 0; i < req.files.length; ++i) {
			files.push(req.files[i]['filename']);
		}

		res.json(files);
	});
});

app.post('/place',  async(req, res) => {
	const data = await tokenData(req);
	const {
		title,
		address,
		addedPhotos,
		description,
		benefits,
		extra,
		checkIn,
		checkOut,
		maxGuests,
		price
	} = req.body;

	if (!data) return res.json(null);

	const place = await Place.create({
		owner: data.id,
		title,
		address,
		photos: addedPhotos,
		description,
		benefits,
		extra,
		checkIn,
		checkOut,
		maxGuests,
		price
	});

	res.json(place);
});

app.put('/place', async (req, res) => {
	const data = await tokenData(req);
	const {
		id, 
		title,
		address,
		addedPhotos,
		description,
		benefits,
		extra,
		checkIn,
		checkOut,
		maxGuests,
		price
	} = req.body;

	if (!data) return res.json(null);

	const place = await Place.findById(id);

	if (place?.owner == data.id) {
		await place.set({
			title,
			address,
			photos: addedPhotos,
			description,
			benefits,
			extra,
			checkIn,
			checkOut,
			maxGuests,
			price
		})

		await place.save();

		return res.json(place);
	}

	res.json(null);
});

app.post('/book', async (req, res) => {
	const data = await tokenData(req);
	const {
		place: id,
		checkIn,
		checkOut,
		guestsNumber,
		name,
		phoneNumber
	} = req.body;
	const place = await Place.findById(id);

	if (!data || !place) return res.json(null);

	const price = differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) * place.price;

	try {
		const book = await Book.create({
			user: data.id,
			place: place._id,
			checkIn,
			checkOut,
			guestsNumber,
			name,
			phoneNumber,
			price
		});

		res.json(book);
	} catch(e) {
		res.json(e);
	}
});

app.listen(5555, () => {
	console.log('Server started');
});
