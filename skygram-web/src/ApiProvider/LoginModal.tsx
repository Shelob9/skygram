import { configureOAuth, createAuthorizationUrl, resolveFromIdentity } from '@atcute/oauth-browser-client';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import clsx from 'clsx';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputField from '../components/Form/InputField';

const buttonClassName = clsx(
  "hover:scale-105 transition-transform duration-200 ease-out",
  "border-black border-2 rounded-md",
  "py-2 px-4",
   "focus:outline-none  data-[focus]:outline-1 data-[focus]:outline-white",
   "text-sm font-medium text-black data-[hover]:text-black"
);
export default function LoginModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    function onLogin() {
      setIsLoading(true)
      resolveFromIdentity(username.replace('@', ''))
        .then(({ identity, metadata }) => {
          createAuthorizationUrl({
              metadata: metadata,
              identity: identity,
              scope: 'atproto transition:generic',
          }).then((authUrl) => {
              setTimeout(() => {
                  window.location.assign(authUrl);
              }, 2000);
          }).catch((error) => {
              console.error(error);
              setError(error.message);

          }).finally(() => {
              setIsLoading(false);
          });
      });
    }

    useEffect(() => {
      configureOAuth({
        metadata: {
          client_id: 'https://skygram.app/api/oauth.json',
          redirect_uri: 'https://skygram.app/oauth',
        },
      });
    },[]);

    useEffect(() => {
      if( ! username || ! username.length) {
        setError('')
      }
    },[username])

    return (
        <>
          <Button
            onClick={open}
            className={buttonClassName}
          >
            Click To Login
          </Button>

          <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close} __demoMode>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                  transition
                  className={clsx(
                    {
                      "animate-pulse": isLoading,
                    },
                    "border-black border-2 rounded-md",
                    "flex flex-col items-center justify-center w-full max-w-md rounded-xl bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                  )}
                >
                  <DialogTitle as="h3" className="text-base/7 font-medium text-black">
                  </DialogTitle>
                  <div className="mt-2 text-sm/6 text-black/50">
                    <InputField
                      id="username"
                      label="Your Bluesky Username"
                      value={username}
                      onChange={setUsername}
                      help={error ? {isError:true, message:error} :undefined}
                    />
                  </div>
                  <div className="my-4 inline-flex items-center gap-2">
                    <Button
                      className={buttonClassName}
                      onClick={onLogin}
                    >
                      {isLoading ? <LoaderCircleIcon /> : 'Login'}
                    </Button>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </>
      );
}
