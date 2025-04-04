import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import App from './App.jsx'
import { LoadingProvider } from './components/loadingstate/LoadingState.jsx'
import ShopConextProvider from './context/ShopContext.jsx'
import { HelmetProvider } from 'react-helmet-async'

const root = createRoot(document.getElementById('root'))
root.render(
  <HelmetProvider>
    <ShopConextProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </ShopConextProvider>
  </HelmetProvider>
);
