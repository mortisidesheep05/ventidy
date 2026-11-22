import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import './mobile.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3500}
          theme="colored"
        />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)