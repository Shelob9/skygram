import { Button, Dialog, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { LoaderCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputField from '../components/Form/InputField';
import { destorySession, startLogin } from './BskyAuth';
import { useApi } from './useApi';

const buttonClassName = clsx(
  "hover:scale-105 transition-transform duration-200 ease-out",
  "border-black border-2 rounded-md",
  "py-2 px-4",
   "focus:outline-none  data-[focus]:outline-1 data-[focus]:outline-white",
   "text-sm font-medium text-black data-[hover]:text-black"
);

const LogoutButton = () => (
  <Button className={clsx(buttonClassName,'text-white border-white mt-4 data-[hover]:text-black data-[hover]:bg-white data-[hover]:border-white')} onClick={() => destorySession()}>
      Logout
  </Button>
);

function LoggedInMenu() {
  return (
    <Menu>
      <MenuButton
        className={buttonClassName}
      >
        Logged In
      </MenuButton>
      <MenuItems
                className="rounded border py-4 px-2 bg-black text-white  origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      anchor="bottom">
        <MenuItem >
          {({ close }) => (
            <Link className={clsx('border-b-2','block')} href="/feedgen" onClick={close}>
              Feed Gen
            </Link>
          )}
        </MenuItem>
        <MenuItem>
          {({ close }) => (
            <Link className={clsx('border-b-2','block')}  href="/" onClick={close}>
              Home
            </Link>
          )}
        </MenuItem>
        <MenuItem>
            <LogoutButton />
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
export default function LoginModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const {loggedInUser} = useApi()
    function open() {
        setUsername('bot.josh412.com')
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    function onLogin() {
      setIsLoading(true)
      startLogin(username).then(() => {
        //SHOULD NEVER BE HERE.
      }).catch((error) => {
        console.error({startLoginError:error})
        setError(error.message)
      }).finally(() => {
        setIsLoading(false)
      });

    }

    useEffect(() => {
    },[]);

    useEffect(() => {
      if( ! username || ! username.length) {
        setError('')
      }
    },[username])

    if(loggedInUser) {
      return <LoggedInMenu />
    }

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
