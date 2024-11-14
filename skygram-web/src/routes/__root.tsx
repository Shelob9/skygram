import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { Agent } from '@atproto/api';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import ApiProvider from '../ApiProvider';
import Aside from '../Skygram/Aside';
import Header from '../Skygram/Header';
const agent = new Agent({
  service:
    "https://api.bsky.app",
});
const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <ApiProvider agent={agent}>
      <QueryClientProvider client={queryClient}>
        <>
          <Header />
          <main className="grid grid-cols-1 md:grid-cols-3 mx-auto md:max-w-6xl">
            <section className="md:col-span-2">
              <Outlet />
            </section>
            <Aside/>
          </main>
        </>


        <TanStackRouterDevtools />
    </QueryClientProvider>
    </ApiProvider>
  ),
})