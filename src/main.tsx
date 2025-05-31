import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log the API key to the console for debugging
console.log('VITE_OPENAI_API_KEY from main.tsx:', import.meta.env.VITE_OPENAI_API_KEY);

createRoot(document.getElementById("root")!).render(<App />);
