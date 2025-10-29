import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './pages/Home.jsx';
import Admin from './pages/Admin.jsx';
import './style.css';

function App() {
  const path = location.pathname;
  if (path.startsWith('/admin')) return <Admin />;
  return <Home />;
}

createRoot(document.getElementById('root')).render(<App />);
