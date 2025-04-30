
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

const container = document.getElementById('root')

// Ensure the root element exists
if (!container) {
  throw new Error('Root element not found. Make sure there is an element with id "root" in index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
