import { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  const { setUser } = useContext(UserContext);

  async function login(e) {
    e.preventDefault();

    try {
      const { data } = await axios.post('/login', {
        email,
        password
      });

      setUser(data);

      setRedirect(true);
    } catch(e) {
      alert('Invalid credentials');
    }
  }

  if (redirect)
    return <Navigate to='/' />

  return (
    <div className='flex mt-4 grow items-center justify-around'>
      <div className='mb-64'>
        <h1 className='text-4xl text-center mb-4'>Login</h1>
        <form className='max-w-md mx-auto' onSubmit={login}>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className='primary'>Login</button>
          <div className='text-center text-gray-500 py-2'>
            Don't have an account yet? <Link to='/signup' className='underline text-break'>Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
