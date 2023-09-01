import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddressLink from '../AddressLink';
import Gallery from '../Gallery';
import BookingWidget from '../BookingWidget';
import axios from 'axios';

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState([]);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios.get('/places/' + id).then(({ data }) => {
      setPlace(data);
    });
  }, [id]);

  if (!place) return '';

  if (showAllPhotos) {
    return (
      <div className='absolute inset-0 min-h-screen bg-black'>
        <div className='grid gap-4 p-8'>
          <div>
            <h2 className='text-3xl mr-48'>
              Photos of {place.title}
            </h2>
            <button onClick={() => setShowAllPhotos(false)} className='flex fixed right-12 top-8 bg-primary shadow shadow-primary rounded-2xl gap-1 px-4 py-2'>
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
              Close
            </button>
          </div>
          {!!place?.photos && place.photos.map(photo => (
            <div>
              <img src={'http://localhost:5555/userfiles/' + photo} alt={place.title} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='mt-8 -mx-8 px-8 pt-8'>
      <h1 className='text-3xl'>
        {place.title}
      </h1>
      <AddressLink>{place.address}</AddressLink>
      <Gallery place={place} />
      <div className='grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 mt-8 mb-8'>
        <div>
          <div className='my-4'>
            <h2 className='font-semibold text-2xl'>
              Description
            </h2>
            {place.description}
          </div>
          Check-in: {place.checkIn} <br />
          Check-out: {place.checkOut} <br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className=' border-t border-gray-500 -mx-8 px-8 py-8'>
        <h2 className='font-semibold text-white text-2xl'>
          Extra info
        </h2>
        <div className='text-sm text-gray-500 leading-4 mt-2 mb-4'>
          {place.extra}
        </div>
      </div>
    </div>
  );
}
