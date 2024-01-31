import React from "react";
import { UserContextProvider } from "./components/UserContext";
import axios from "axios"
import Routes from "./components/Routes";

function App() {
  axios.defaults.baseURL = 'http://localhost:3000';
  axios.defaults.withCredentials = 'true';

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

export default App
