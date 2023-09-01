import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileNav from '../ProfileNav';
import PlacesFormPage from './PlacesFormPage';
import PlaceImage from '../PlaceImage';
import axios from 'axios';

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <ProfileNav />
      <div className='text-center'>
        <Link to='/account/places/new' className='inline-flex bg-primary text-white px-6 py-2 gap-1 rounded-full'>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
          </svg>
          New place
        </Link>
      </div>
      <div className='mt-4'>
        {!!places && places.map(place => (
          <Link to={'/account/places/' + place._id} key={place._id} className='flex cursor-pointer bg-gray-100 rounded-2xl gap-4 p-4'>
            <div className='flex bg-gray-300'>
              <PlaceImage place={place} />
            </div>
            <div className='grow-0 shrink text-black'>
              <h2 className='text-xl'>
                {place.title}
              </h2>
              <p className='text-sm mt-2'>
                {place.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
