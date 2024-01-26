import React, { useState } from 'react'



function register() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')

  return (
    <div className='bg-blue-50 h-screen flex items-center'>
      <form action="" className='w-64 mx-auto'>
        <input type="text" value={username} 
        onChange={ev => setUsername(ev.target.value)} 
        placeholder='username' className='block w-full rounded-sm p-2 mb-2 border'/>
        <input type="password" value={password} onChange={ev => setPassword(ev.target.value)} placeholder='password' className='block w-full rounded-sm p-2 mb-2 border'/>
        <button className='bg-blue-500 text-white block w-full rounded-sm p-2'>Register</button>
      </form>
    </div>
  )
}

export default register