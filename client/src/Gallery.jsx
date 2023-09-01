import { useState } from 'react';

export default function Gallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

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
    <div className='relative'>
      <div className='grid grid-cols-[2fr_1fr] rounded-2xl overflow-hidden gap-2'>
        <div>
          {place.photos?.[0] && (
            <div>
              <img onClick={() => setShowAllPhotos(true)} src={'http://localhost:5555/userfiles/' + place.photos[0]} alt={place.title} className='aspect-square object-cover cursor-pointer' />
            </div>
          )}
        </div>
        <div className='grid'>
          {place.photos?.[1] && (
            <img onClick={() => setShowAllPhotos(true)} src={'http://localhost:5555/userfiles/' + place.photos[1]} alt={place.title} className='aspect-square object-cover cursor-pointer' />
          )}
          <div className='overflow-hidden'>
            {place.photos?.[2] && (
              <img onClick={() => setShowAllPhotos(true)} src={'http://localhost:5555/userfiles/' + place.photos[2]} alt={place.title} className='relative aspect-square object-cover cursor-pointer top-2' />
            )}
          </div>
        </div>
      </div>
      <button onClick={() => setShowAllPhotos(true)} className='flex absolute bg-white text-black rounded-2xl shadow shadow-md shadow-gray-500 bottom-2 right-2 gap-1 px-4 py-2'>
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
        </svg>
        More
      </button>
    </div>
  );
}