import { createRootRoute, Outlet } from '@tanstack/react-router';

import { Agent } from '@atproto/api';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { lazy } from 'react';
import ApiProvider from '../ApiProvider';
const agent = new Agent({
  service:
    "https://api.bsky.app",
});
const queryClient = new QueryClient()
const TanStackRouterDevtools = import.meta.env.PROD  ? () => null: lazy(() =>
  import('@tanstack/router-devtools').then(module => ({ default: module.TanStackRouterDevtools }))
);
export const Route = createRootRoute({
  component: () => (
    <>
      <ApiProvider agent={agent}>
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
