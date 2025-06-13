import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/homePage'
import { ClientPage } from './pages/ClientPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/clients" element={<ClientPage />} />
        {/* Agrega más rutas aquí */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)