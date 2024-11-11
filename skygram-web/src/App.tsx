
"use client"
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import Skygram from "./Skygram";
const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <Skygram />
    </QueryClientProvider>
  )
}

export default App
