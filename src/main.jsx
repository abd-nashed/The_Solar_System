import React from 'react';
import ReactDOM from 'react-dom/client';
import { useGLTF } from '@react-three/drei';
import App from './App.jsx';
import './index.css';

const base = import.meta.env.BASE_URL || '/';
const normalizedBase = base.endsWith('/') ? base : `${base}/`;

try {
  useGLTF.setDecoderPath(`${normalizedBase}draco/`);
} catch (e) {
  console.warn('DRACO decoder not configured:', e);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);