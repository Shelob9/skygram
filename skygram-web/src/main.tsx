import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './BskyAuth/AuthProvider.tsx'
import { ENV, HANDLE_RESOLVER_URL, PLC_DIRECTORY_URL } from './BskyAuth/constants.ts'
import './index.css'
const clientId = `http://localhost?${new URLSearchParams({
  scope: 'atproto transition:generic',
  redirect_uri: Object.assign(new URL(window.location.origin), {
    hostname: 'http://localhost',
    search: new URLSearchParams({
      env: ENV,
      handle_resolver: 'https://bsky.social',
    }).toString(),
  }).href,
})}`
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider
      clientId={clientId}
      plcDirectoryUrl={PLC_DIRECTORY_URL}
      handleResolver={HANDLE_RESOLVER_URL}
      allowHttp={ENV === 'development' || ENV === 'test'}
    >
      <App />
    </AuthProvider>

  </StrictMode>,
)
