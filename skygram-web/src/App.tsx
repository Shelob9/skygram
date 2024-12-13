
"use client"
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import ApiProvider from './ApiProvider';
import Skygram from "./Skygram";

const queryClient = new QueryClient()
function App() {
  return (
    <ApiProvider >
      <QueryClientProvider client={queryClient}>
          <Skygram />
      </QueryClientProvider>
    </ApiProvider>
  )
}

export default App
