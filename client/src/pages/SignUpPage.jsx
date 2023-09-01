import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signUp(e) {
    e.preventDefault();

    try {
      await axios.post('/signup', {
        name,
        email,
        password
      });

      alert('Account created!');
    } catch(e) {
      alert('Registration failed');
    }
  }

  return (
    <div className='flex mt-4 grow items-center justify-around'>
      <div className='mb-64'>
        <h1 className='text-4xl text-center mb-4'>Registration</h1>
        <form className='max-w-md mx-auto' onSubmit={signUp}>
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={e => setName(e.target.value)}
          />
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
          <button className='primary'>Sign Up</button>
          <div className='text-center text-gray-500 py-2'>
            Already a member? <Link to='/login' className='underline text-break'>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
