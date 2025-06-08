import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css';
import App from './App.jsx'
import axios from "axios";
import { UserProvider } from "./context/userContext";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://ace-vihaari.onrender.com"; // Adjust if needed

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
)
