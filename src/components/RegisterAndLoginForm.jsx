import React, { useContext, useState } from 'react'
import axios from 'axios';
import UserContext from './UserContext';

function RegisterAndLoginForm() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register')
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';
    const { data } = await axios.post(url, { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  }

  return (
    <div className='bg-cust-grey h-screen flex items-center'>
      <form action="" className='w-64 mx-auto' onSubmit={handleSubmit}>
        <input type="text" value={username}
          onChange={ev => setUsername(ev.target.value)}
          placeholder='username' className='block w-full rounded-sm p-2 mb-2 border' />
        <input type="password" value={password} onChange={ev => setPassword(ev.target.value)} placeholder='password' className='block w-full rounded-sm p-2 mb-2 border' />
        <button className='bg-blue-500 text-white block w-full rounded-sm p-2'>
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </button>

        <div className='text-center mt-2 text-white'>
          {isLoginOrRegister === 'register' && (
            <div>
              Already a member?
              <button onClick={() => setIsLoginOrRegister('login')}>Login here</button>
            </div>
          )}

          {isLoginOrRegister === 'login' &&(
            <div>
              Don't have a account?
              <button onClick={() => setIsLoginOrRegister('register')}>Register here</button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default RegisterAndLoginForm