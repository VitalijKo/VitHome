import { useState, useContext } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import ProfileNav from '../ProfileNav';
import PlacesPage from './PlacesPage';
import axios from 'axios';

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(false);

  const { ready, user, setUser } = useContext(UserContext);

  let { subpage } = useParams();

  if (subpage === undefined) subpage = 'profile';

  async function logout() {
    await axios.post('/logout');

    setUser(null);
    setRedirect(true);
  }

  if (redirect) return <Navigate to='/' />;

  if (!ready) return 'Loading...';

  if (ready && !user && !redirect ) return <Navigate to='/login' />;

  return (
    <div>
      <ProfileNav subpage={subpage} />
      {subpage === 'profile' && (
        <div className='text-center max-w-lg mx-auto'>
          Logged in as {user.name} ({user.email})
          <br />
          <button onClick={logout} className='primary max-w-sm mt-8'>Logout</button>
        </div>
      )}
      {subpage === 'places' && <PlacesPage />}
    </div>
  );
}
