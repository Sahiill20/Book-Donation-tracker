import { StrictMode } from 'react'
import router from './routers/Router.jsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>  {/* Wrap the RouterProvider with AuthProvider */}
    <RouterProvider router={router} />
  </AuthProvider>
  </StrictMode>,
)