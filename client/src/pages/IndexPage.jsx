import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 mt-8'>
      {!!places && places.map(place => (
        <Link to={'/place/' + place._id}>
          <div className='flex bg-gray-500 rounded-2xl mb-2'>
            {place.photos?.[0] && (
              <img src={'http://localhost:5555/userfiles/' + place.photos[0]} alt={place.title} className='object-cover aspect-square rounded-2xl' />
            )}
          </div>
          <h3 className='font-bold'>
            {place.address}
          </h3>
          <h2 className='text-sm text-gray-500'>
            {place.title}
          </h2>
          <div className='mt-1'>
            <span className='font-bold'>{place.price}$</span> per night
          </div>
        </Link>
      ))}
    </div>
  );
}
