import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileNav from '../ProfileNav';
import PlaceImage from '../PlaceImage';
import BookDates from '../BookDates';
import axios from 'axios';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('/bookings').then(({ data }) => {
      setBookings(data);
    });
  }, []);

  return (
    <div>
      <ProfileNav />
      <div>
        {!!bookings && bookings.map(book => (
          <Link to={'/account/bookings/' + book._id} className='flex border border-gray-500 rounded-2xl overflow-hidden gap-4'>
            <div className='w-48'>
              <PlaceImage place={book.place} className='object-cover h-full' />
            </div>
            <div className='grow pr-2 py-3'>
              <h2 className='text-xl'>
                {book.place.title}
              </h2>
              <div className='text-xl'>
                <BookDates book={book} className='text-gray-500 mt-4 mb-2' />
                <div className='flex gap-1 mt-4'>
                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-8 h-8'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' />
                  </svg>
                  <span className='text-xl'>
                    Total price: {book.price}$
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
