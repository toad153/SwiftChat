import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from "axios"
import Avatar from './Avatar';
import Logo from './Logo';
import Contact from './Contact';
import UserContext from './UserContext';
import { uniqBy } from 'lodash';
// import { response } from 'express';

function Chat() {

    // States for various functions
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setofflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState('')
    const [messages, setMessages] = useState([]);
    const { username, id } = useContext(UserContext);
    const divUnderMessages = useRef()

    // creating a websocket connection

    useEffect(() => {
        connectToWs();
    }, []);

    function connectToWs(){
        const ws = new WebSocket('ws://localhost:3000');
        setWs(ws);
        ws.addEventListener('message', handleMessage)    
        ws.addEventListener('close', () => {
            setTimeout(()=>{
                console.log('Disconnected Trying to reconnect...');
                connectToWs();
            }, 1000)
        }); // for auto reconnecting
    }

    //fetching message history from database

    useEffect(() => {
        if (selectedUserId) {
            axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data);
            });
        }
    }, [selectedUserId])
    

    // To show people who are online:
    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username
        });
        setOnlinePeople(people);
    }

    // Handle to check people who are online

    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data);
        console.log({ ev, messageData })
        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            setMessages(prev => ([...prev, { ...messageData }]))
        }
    }

    const onlinePeopleExcl = { ...onlinePeople };
    delete onlinePeopleExcl[id];

    // function to remove dupe messages being sent
    const messageWoDupes = uniqBy(messages, '_id')

    // function to send a message

    function sendMessage(ev) {
        ev.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
        }));
        setNewMessageText('');
        setMessages(prev => ([...prev, {
            text: newMessageText,
            sender: id,
            recipient: selectedUserId,
            _id: Date.now(),
        }]));



    }

    useEffect(() => {
        const div = divUnderMessages.current;
        if (div) {
            div.scrollIntoView({ behaviour: 'smooth', block: 'end' });
        }

    }, [messages])

    // to show offline people
    useEffect(() =>{
        axios.get('/people').then(res => {
            const offlinePeopleArr = res.data
            .filter(p => p._id !==id )
            .filter(p => !Object.keys(onlinePeople).includes(p._id));
            const offlinePeople = {};
            offlinePeopleArr.forEach(p=> {
                offlinePeople[p._id] = p;
            });
            setofflinePeople(offlinePeople);
        });
    }, [onlinePeople]);

    return (

        // List of users on left side
        <div className='flex h-screen'>
            <div className='bg-cust-dark w-1/3'>
                <Logo />
                {Object.keys(onlinePeopleExcl).map(userId => (
                    <Contact 
                    key={userId}
                    id={userId} 
                    online = {true}
                    username={onlinePeopleExcl[userId]}
                    onClick={() => setSelectedUserId(userId)}
                    selected = {userId === selectedUserId}
                    />
                ))}
                {Object.keys(offlinePeople).map(userId => (
                    <Contact
                    key={userId} 
                    id={userId} 
                    online = {false}
                    username={offlinePeople[userId].username}
                    onClick={() => setSelectedUserId(userId)}
                    selected = {userId === selectedUserId}
                    />
                ))}
            </div>
            <div className=" flex flex-col bg-cust-grey w-2/3 p-2">
                <div className='flex-grow'>
                    {!selectedUserId && (
                        <div className='flex h-full items-center justify-center'>
                            <div className='text-gray-600'>
                                Select a Conversation
                            </div>
                        </div>
                    )}

                    {!!selectedUserId && (
                        <div className='relative h-full mb-2'>
                            <div className='overflow-y-scroll absolute inset-0'>
                                {messageWoDupes.map(message => (
                                    <div key={message._id} className={message.sender === id ? 'text-right' : 'text-left'}>
                                        <div className={" inline-block p-2 my-2 rounded-sm text-sm " + (message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700')}>
                                            {/* sender:{message.sender} <br />
                                        my id:{id} <br /> */}
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMessages} ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Message Form */}

                {!!selectedUserId && (
                    <form className='flex gap-2' onSubmit={sendMessage}>
                        <input type="text" value={newMessageText}
                            onChange={ev => setNewMessageText(ev.target.value)}
                            placeholder='Type your message here' className="bg-white flex-grow border rounded-sm p-2" />
                        <button type='submit' className='bg-cyan-600 p-2 rounded-sm text-white'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Chat