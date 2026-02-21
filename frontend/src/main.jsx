import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes,BrowserRouter } from "react-router-dom";
import './index.css'
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <CookiesProvider>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
    </CookiesProvider>
    </BrowserRouter>
  </StrictMode>,
)
