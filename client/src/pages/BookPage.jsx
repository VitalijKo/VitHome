import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddressLink from '../AddressLink';
import Gallery from '../Gallery';
import BookDates from '../BookDates';
import axios from 'axios';

export default function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios.get('/bookings/').then(({ data }) => {
      setBook(data.find(({ _id }) => _id === id));
    });
  }, [id]);

  if (!book) return '';

  return (
    <div className='mt-8 -mx-8 px-8 pt-8'>
      <h1 className='text-3xl'>
        {book.place.title}
      </h1>
      <AddressLink>{book.place.address}</AddressLink>
      <div className='flex border border-gray-500 justify-between items-cetner rounded-2xl my-6 p-6'>
        <div>
          <h2 className='text-2xl mb-4'>
            Booking info
          </h2>
          <BookDates book={book} />
        </div>
        <div className='bg-primary text-white rounded-2xl p-6'>
          <div>
            Total price
          </div>
          <div className='text-3xl'>
            {book.price}$
          </div>
        </div>
      </div>
      <Gallery place={book.place} />
    </div>
  );
}
