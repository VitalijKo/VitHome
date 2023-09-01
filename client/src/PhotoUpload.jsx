import { useState } from 'react';
import axios from 'axios';

export default function PhotoUpload({ addedPhotos, onChange }) {
  const [photoLink, setPhotoLink] = useState('');

  async function addPhotoByLink(e) {
    e.preventDefault();

    if (!photoLink) return;

    try {
      const { data: filename } = await axios.post('/upload-link', {
        link: photoLink
      });

      onChange(prev => {
        return [...prev, filename];
      });
    } catch(e) {
      alert('Invalid link');
    }

    setPhotoLink('');
  }

  function uploadPhoto(e) {
    const files = e.target.files;
    const data = new FormData();

    for (let i = 0; i < files.length; ++i) {
      data.append('photos', files[i]);
    }

    axios.post('/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).catch(err => {
      return alert('Invalid photo');
    }).then(({ data: filenames }) => {
      onChange(prev => {
        return [...prev, ...filenames];
      });
    });
  }

  function removePhoto(e, filename) {
    e.preventDefault();

    onChange(addedPhotos.filter(photo => photo !== filename));
  }

  function makeMain(e, filename) {
    e.preventDefault();

    onChange([filename, ...addedPhotos.filter(photo => photo !== filename)]);
  }

  return (
    <>
      <div className='flex gap-2'>
        <input
          type='text'
          value={photoLink}
          onChange={e => setPhotoLink(e.target.value)}
          placholder='Link to photos... (JPG only)'
        />
        <button onClick={addPhotoByLink} className='bg-primary rounded-2xl px-4'>Add&nbsp;photo</button>
      </div>
      <div className='grid grid-cols-3 gap-2 mt-2 md:grid-cols-4 lg:grid-cols-6'>
        {!!addedPhotos && addedPhotos.map(link => (
          <div key={link} className='flex relative h-32'>
            <img src={'http://localhost:5555/userfiles/' + link} className='w-full object-cover rounded-2xl' />
            <button onClick={e => removePhoto(e, elink)} className='absolute cursor-pointer bg-black bg-opacity-50 rounded-2xl bottom-1 right-1 px-3 py-2'>
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
            <button onClick={e => makeMain(e, link)} className='absolute cursor-pointer bg-black bg-opacity-50 rounded-2xl bottom-1 left-1 px-3 py-2'>
              {link === addedPhotos[0] ? (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                  <path fillRule='evenodd' d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z' clipRule='evenodd' />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' />
                </svg>
              )}
            </button>
          </div>
        ))}
        <label className='flex h-32 cursor-pointer items-center justify-center gap-2 border bg-transparent rounded-2xl text-2xl text-gray-300 p-2'>
          <input
            type='file'
            multiple={true}
            onChange={uploadPhoto}
            className='hidden'
          />
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-8 h-8'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5' />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
}
