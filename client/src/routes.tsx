import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

// Direct imports for instant, reliable route transitions
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import StayDetail from '@/pages/StayDetail';
import Wishlists from '@/pages/Wishlists';
import Checkout from '@/pages/Checkout';
import Host from '@/pages/Host';
import BecomeAHost from '@/pages/BecomeAHost';
import Experiences from '@/pages/Experiences';
import ExperienceDetail from '@/pages/ExperienceDetail';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Trips from '@/pages/Trips';
import Profile from '@/pages/Profile';
import MessagesPage from '@/pages/MessagesPage';
import NotFound from '@/pages/NotFound';

// Admin Portal Imports
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/auth/AdminRoute';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProperties from '@/pages/admin/AdminProperties';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminReviews from '@/pages/admin/AdminReviews';

export const router = createBrowserRouter([
  {
    path: '/admi',
    element: <Navigate to="/admin" replace />,
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'properties',
        element: <AdminProperties />,
      },
      {
        path: 'bookings',
        element: <AdminBookings />,
      },
      {
        path: 'users',
        element: <AdminUsers />,
      },
      {
        path: 'reviews',
        element: <AdminReviews />,
      },
    ],
  },
  {
    path: '/become-a-host',
    element: <BecomeAHost />,
  },
  {
    path: '/host/onboarding',
    element: <BecomeAHost />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'profile',
        element: <Profile />,
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
        path: 'messages',
        element: <MessagesPage />,
      },
      {
        path: 'messages/:chatId',
        element: <MessagesPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
