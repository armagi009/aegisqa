import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { AppLayout } from '@/components/layout/AppLayout';
import { PullRequestsPage } from '@/pages/PullRequestsPage';
import { PullRequestDetailPage } from '@/pages/PullRequestDetailPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SupportPage } from '@/pages/SupportPage';
const router = createBrowserRouter([
  {
    element: <AppLayout><RouteErrorBoundary /></AppLayout>, // Wrap all routes in AppLayout
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/pull-requests",
        element: <PullRequestsPage />,
      },
      {
        path: "/pull-requests/:id",
        element: <PullRequestDetailPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/support",
        element: <SupportPage />,
      },
    ]
  }
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)