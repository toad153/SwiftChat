import axios from "axios";
import React, { useState, createContext, useEffect } from "react";

const UserContext = createContext({});


export function UserContextProvider({ children }) {
    const [username, setUsername] = useState(null); // Fix: Added setUsername
    const [id, setId] = useState(null);
    useEffect(() =>{
        axios.get('/profile').then(response => {
            setId(response.data.userId);
            setUsername(response.data.username);
        });
    }, [])
    return (
        <UserContext.Provider value={{ username, setUsername, id, setId }}> {/* Fix: Corrected UserContext */}
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;
