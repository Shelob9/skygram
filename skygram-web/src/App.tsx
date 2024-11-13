
"use client"
import { Agent } from '@atproto/api';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import ApiProvider from './ApiProvider';
import Skygram from "./Skygram";
const agent = new Agent({
  service:
    "https://api.bsky.app",
});

const queryClient = new QueryClient()
function App() {
  return (
    <ApiProvider agent={agent}>
      <QueryClientProvider client={queryClient}>
          <Skygram />
      </QueryClientProvider>
    </ApiProvider>
  )
}

export default App
