import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import '@styles/index.css';
import Home from '@pages/Home.tsx';

import reactQueryClient from './configs/reactQueryClient';
import RouterSpinner from './components/common/RouterSpinner';

const RoomPage = lazy(() => import('./pages/Room'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/:roomId',
    element: (
      <Suspense fallback={<RouterSpinner />}>
        <RoomPage />
      </Suspense>
    ),
  },
]);

function Main() {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
