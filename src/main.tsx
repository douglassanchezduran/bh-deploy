import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { HeroUIProvider, ToastProvider } from '@heroui/react';

import MainRoutes from './MainRoutes';
import './main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </HeroUIProvider>
  </React.StrictMode>,
);
