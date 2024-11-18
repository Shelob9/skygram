import { createRootRoute, Outlet } from '@tanstack/react-router';

import { Agent } from '@atproto/api';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import ApiProvider from '../ApiProvider';
const agent = new Agent({
  service:
    "https://api.bsky.app",
});
const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <ApiProvider agent={agent}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
    </QueryClientProvider>
    </ApiProvider>
  ),
})
