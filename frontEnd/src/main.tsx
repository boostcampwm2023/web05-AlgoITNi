import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@styles/index.css';
import Home from '@pages/Home.tsx';
import Room from '@pages/Room.tsx';
import Modals from './components/modal/Modals';

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
function Main() {
  return (
    <>
      <RouterProvider router={router} />
      <Modals />
    </>
  );
}
ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
