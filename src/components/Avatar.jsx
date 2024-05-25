import React from 'react'

function Avatar({ userId, username, online }) {

    const colors = ['bg-teal-300', 'bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-purple-300', 'bg-cyan-300'];
    const userIdbase10 = parseInt(userId, 16);
    const colorIndex = userIdbase10 % colors.length;
    const color = colors[colorIndex];

    return (
        <div className={'w-8 h-8 relative rounded-full flex items-center ' + color}>
            <div className='text-center w-full opacity-80'>
                {username[0]}
            </div>
            {online && (
                <div className='absolute w-3 h-3 bg-green-400 rounded-lg -bottom-0 right-0 border border-white'></div>
            )}
        </div>
    )
}

export default Avatar