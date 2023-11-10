import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@pages/Home.tsx';
import Room from '@pages/Room.tsx';
import '@styles/index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/:roomId',
    element: <Room />,
  },
]);
ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
