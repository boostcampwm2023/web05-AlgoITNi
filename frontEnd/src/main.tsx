import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import '@styles/index.css';
import Home from '@pages/Home.tsx';

import Modals from './components/modal/Modals';
import reactQueryClient from './configs/reactQueryClient';
import { CRDTProvider } from './contexts/crdt';

const RoomPage = lazy(() => import('./pages/Room'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/:roomId',
    element: (
      <Suspense fallback={<span>Loading...</span>}>
        <RoomPage />
      </Suspense>
    ),
  },
]);

function Main() {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <CRDTProvider>
        <RouterProvider router={router} />
        <Modals />
      </CRDTProvider>
    </QueryClientProvider>
  );
}
ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
