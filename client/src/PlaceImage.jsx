export default function PlaceImage({ place, index=0, className='object-cover' }) {
  if (!place.photos) return '';

  return <img src={'http://localhost:5555/userfiles/' + place.photos[index]} alt={place.title} className={className} />;
}
