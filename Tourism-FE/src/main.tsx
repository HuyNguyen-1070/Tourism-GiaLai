import './index.css';
import React from 'react';
import { router } from '@/routes';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ToastProvider } from '@/components/common/ToastNotification/index.tsx';
import AwakePinger from '@/components/awake';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Provider store={store}>
          <ToastProvider>
            <AwakePinger />
            <RouterProvider router={router} />
          </ToastProvider>
        </Provider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
