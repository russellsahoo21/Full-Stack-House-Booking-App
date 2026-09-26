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
import ExperienceDetail from '@/pages/ExperienceDetail';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Trips from '@/pages/Trips';
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
        path: 'experience/:id',
        element: <ExperienceDetail />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'service/:id',
        element: <ServiceDetail />,
      },
      {
        path: 'trips',
        element: <Trips />,
      },
      {
        path: 'bookings',
        element: <Trips />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
