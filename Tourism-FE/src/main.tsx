import './index.css';
import React from 'react';
import { router } from '@/routes';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ToastProvider } from '@/components/common/ToastNotification/index.tsx';
import AwakePinger from '@/components/awake';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <ToastProvider>
          <AwakePinger />
          <RouterProvider router={router} />
        </ToastProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
