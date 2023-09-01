import { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ProfileNav from '../ProfileNav';
import PhotoUpload from '../PhotoUpload';
import Benefits from '../Benefits';
import axios from 'axios';

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState([]);
  const [extra, setExtra] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(2);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios.get('/places/' + id).then(({ data }) => {
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setBenefits(data.benefits);
      setExtra(data.extra);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className='text-2xl mt-4'>{text}</h2>;
  }

  function inputDescription(text) {
    return <p className='text-gray-500 text-sm'>{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(e) {
    e.preventDefault();

    const data = {
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
    };

    id ? await axios.put('/place', { id, ...data }) : await axios.post('/place', data);

    setRedirect(true);
  }

  if (redirect) return <Navigate to='/account/places' />;

  return (
    <>
      <ProfileNav />
      <form onSubmit={savePlace}>
        {preInput('Title', 'The title of your place. Must be short and clear')}
        <input
          type='text'
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder='Title (ex. My Apartment)'
        />
        {preInput('Address', 'The address of your place')}
        <input
          type='text'
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder='Address'
        />
        {preInput('Photos', 'Photos should be of high quality and show your place well. The more the better')}
        <PhotoUpload addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput('Description', 'Describe your place in detail')}
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {preInput('Benefits', 'Select the benefits of your place')}
        <div className='grid grid-cols-2 mt-2 gap-2 md:grid-cols-3 lg:grid-cols-6'>
          <Benefits selected={benefits} onChange={setBenefits} />
        </div>
        {preInput('Extra info', 'House rules, etc')}
        <textarea
          value={extra}
          onChange={e => setExtra(e.target.value)}
        />
        {preInput('Check In/Out times, max guests', 'Add check-in and check-out times. Remember the time between preparations between guests')}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
          <div className='mt-2 -mb-1'>
            <h3>Check-in time</h3>
            <input
              type='text'
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              placeholder='14'
            />
          </div>
          <div className='mt-2 -mb-1'>
            <h3>Check-out time</h3>
            <input
              type='text'
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              placeholder='20'
            />
          </div>
          <div className='mt-2 -mb-1'>
            <h3>Max number of guests</h3>
            <input
              type='number'
              value={maxGuests}
              onChange={e => setMaxGuests(e.target.value)}
            />
          </div>
          <div className='mt-2 -mb-1'>
            <h3>Price per night</h3>
            <input
              type='number'
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
        </div>
        <button className='primary my-4'>Save</button>
      </form>
    </>
  );
}
