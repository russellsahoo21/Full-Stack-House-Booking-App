import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

// Direct imports for instant, reliable route transitions
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import StayDetail from '@/pages/StayDetail';
import Wishlists from '@/pages/Wishlists';
import Checkout from '@/pages/Checkout';
import Host from '@/pages/Host';
import Experiences from '@/pages/Experiences';
import Services from '@/pages/Services';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'stay/:id',
        element: <StayDetail />,
      },
      {
        path: 'wishlists',
        element: <Wishlists />,
      },
      {
        path: 'book/:id',
        element: <Checkout />,
      },
      {
        path: 'host',
        element: <Host />,
      },
      {
        path: 'experiences',
        element: <Experiences />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
