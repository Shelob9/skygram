import { createAuthorizationUrl, resolveFromIdentity } from '@atcute/oauth-browser-client';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import InputField from '../components/Form/InputField';

export default function LoginModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    function onLogin() {
        resolveFromIdentity(username)
          .then(({ identity, metadata }) => {
            console.log({ identity, metadata });
            createAuthorizationUrl({
                metadata: metadata,
                identity: identity,
                scope: 'atproto transition:generic transition:chat.bsky',
            }).then((authUrl) => {
                setTimeout(() => {
                    window.location.assign(authUrl);
                }, 200);
            }).catch((error) => {
                console.log({ error });
                setError(error.message);
            });
        });
    }

    return (
        <>
          <Button
            onClick={open}
            className="rounded-md bg-black py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-black/30 data-[hover]:text-black data-[focus]:outline-1 data-[focus]:outline-white"
          >
            Click To Login
          </Button>

          <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                  transition
                  className="flex flex-col items-center justify-center w-full max-w-md rounded-xl bg-black backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                >
                  <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                  {error ? <p className="mt-2 text-sm/6 text-red-500">{error}</p> : <p>Login With Bluesky</p>}

                  </DialogTitle>
                  <p className="mt-2 text-sm/6 text-white/50">
                    <InputField
                      id="username"
                      label="Your Bluesky Username"
                      value={username}
                      onChange={setUsername}
                      help={username && !username.startsWith('@') ? 'Must start with @' : ''}
                    />
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2">
                    <Button
                      className="border-white rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                      onClick={onLogin}
                    >
                      Login
                    </Button>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </>
      );
}
