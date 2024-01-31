import React, { useState, createContext } from "react";

const UserContext = createContext({});


export function UserContextProvider({ children }) {
    const [username, setUsername] = useState(null); // Fix: Added setUsername
    const [id, setId] = useState(null);
    
    return (
        <UserContext.Provider value={{ username, setUsername, id, setId }}> {/* Fix: Corrected UserContext */}
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;
