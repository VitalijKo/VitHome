import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { differenceInCalendarDays } from 'date-fns';
import axios from 'axios';

export default function BookingWidget({ place }) {
  const { user } = useContext(UserContext);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsNumber, setGuestsNumber] = useState(1);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [redirect, setRedirect] = useState('');
  const nights = 0 || (checkIn && checkOut && differenceInCalendarDays(new Date(checkOut), new Date(checkIn)));

  useEffect(() => {
    if(user) setName(user.name);
  }, [user]);

  async function book() {
    const { data } = await axios.post('/book', {
      place: place._id,
      checkIn,
      checkOut,
      guestsNumber,
      name,
      phoneNumber
    });

    setRedirect('/account/bookings/' + data._id);
  }

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className='bg-white text-black shadow rounded-2xl p-4'>
      <div className='text-center text-2xl'>
        Price: {place.price}$ per night
      </div>
      <div className='border rounded-2xl mt-4'>
        <div className='flex'>
          <div className='px-4 py-3'>
            <label>Check-in: </label>
            <input
              type='date'
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
            />
          </div>
          <div className='border-l px-4 py-3'>
            <label>Check-out: </label>
            <input
              type='date'
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        <div className='border-t px-4 py-3'>
          <label>Number of guests: </label>
            <input
              type='number'
              value={guestsNumber}
              onChange={e => setGuestsNumber(e.target.value)}
            />
        </div>
        {nights > 0 && (
          <div className='border-t px-4 py-3'>
            <label>Your full name:</label>
              <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            <label>Your phone number:</label>
              <input
                type='tel'
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
          </div>
        )}
      </div>
      <button onClick={book} className='primary mt-4'>
        Book this place
        {nights > 0 && (
          <span>
            &nbsp;{nights * place.price}$
          </span>
        )}
      </button>
    </div>
  );
}
