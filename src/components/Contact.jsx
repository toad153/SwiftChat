import React from 'react'
import Avatar from './Avatar'

function Contact({id, username, onClick, selected, online}) {
    return (
        <div key={id} onClick={() => onClick(id)}
            className={'border-b border-gray-300 flex items-center gap-2 cursor-pointer ' + (id === selected ? 'bg-blue-400' : '')}>
            {selected && (
                <div className='w-1 bg-cyan-500 h-12'></div>
            )}
            <div className='flex gap-2 py-2 pl-4 items-center'>
                <Avatar online={online} username={username} userId={id} />
                <span className='text-gray-100'>{username}</span>
            </div>
        </div>
    )
}

export default Contact