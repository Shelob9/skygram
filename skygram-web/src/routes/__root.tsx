import { createRootRoute, Outlet } from '@tanstack/react-router';

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { lazy } from 'react';
import ApiProvider from '../ApiProvider';

const queryClient = new QueryClient()
const TanStackRouterDevtools = import.meta.env.PROD  ? () => null: lazy(() =>
  import('@tanstack/router-devtools').then(module => ({ default: module.TanStackRouterDevtools }))
);
export const Route = createRootRoute({
  component: () => (
    <>
      <ApiProvider>
        <QueryClientProvider client={queryClient}>
          <>
            <Outlet />
          </>
          <TanStackRouterDevtools />
        </QueryClientProvider>
      </ApiProvider>
    </>
  ),
})
