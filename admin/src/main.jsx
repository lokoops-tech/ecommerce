import './index.css'
import React from 'react';
import App from './App.jsx'
import ReactDom from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

// Create root element
const root = ReactDom.createRoot(document.getElementById('root'));

// Render app with updated router configuration
root.render(
  <React.StrictMode>
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);