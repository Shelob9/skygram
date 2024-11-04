import { BrowserOAuthClient, OAuthSession } from '@atproto/oauth-client-browser';
import { HouseIcon, PlusCircle, SearchIcon } from "lucide-react";
import { useEffect } from "react";
import { User } from ".";

const logo : {
    src:string;
    alt:string;
} = {
    src: "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:payluere6eb3f6j5nbmo2cwy/bafkreie2aefqvw3bbhn75rpexgzjgbzijul2td3lmkdgo7ibpjx2svy3ou@jpeg",
    alt: "Zinnia flower. Very pink, very bloomed, but still blooming "
}


async function init(){
    const client = await BrowserOAuthClient.load({
        clientId: 'https://skygram.app/api/oauth.json',
      });

    try {
        const result: undefined | { session: OAuthSession; state?: string } = await client.init()

        if (result) {
            const { session, state } = result
            if (state != null) {
                    console.log(
                    `${session.sub} was successfully authenticated (state: ${state})`,
                    )
            } else {
                console.log(`${session.sub} was restored (last active session)`)
            }
        }
        return result;
    } catch (error) {
        console.error({error})
        throw error

    }
}

type HeaderProps = {
    loggedInUser: User
}
function UserAvatar(
    {
        loggedInUser,
    }:HeaderProps
){
    return (
        <img
            className="h-10 rounded-full cursor-pointer"
            src={loggedInUser.avatar}
            alt={`${loggedInUser.username} avatar`}
        />
    )
}
export default function Header({
    //@ts-ignore
    loggedInUser,
}:HeaderProps) {
    useEffect(() => {
        init().then((result) => {
            console.log({
                initResult:result
            })
        }).catch((error) => {
            console.error({initError:error})
        });
    },[])
    return (
        <div className="sticky top-0 border-b shadow-sm bg-white z-30">
          {/** <!-- Header --> */}

          <div
            className="flex justify-between h-24 items-center mx-4 xl:max-w-6xl xl:mx-auto"
          >
            {/** <!-- Left  --> */}


            <div className="cursor-pointer w-24 inline-grid">
              <img
                className="h-10 rounded-full cursor-pointer w-10 rounded-full"
                    src={logo.src}
                    alt={logo.alt}
                />
            </div>
            <div className="cursor-pointer w-24 inline-grid ">
              <h1>Skygram</h1>
            </div>

            {/** <!-- Middle --> */}

            <div className="relative mt-1">
              <div className="absolute top-2 left-2"
                style={{visibility:'hidden'}}
              >
                <SearchIcon />
              </div>
              <input
                style={{visibility:'hidden'}}
                placeholder="Search"
                className="pl-10 rounded-md focus:ring-black focus:border-black bg-gray-50 border-gray-500 text-sm"
                type="text"
              />
            </div>

            {/** <!-- Right --> */}
            <div className="flex space-x-4 items-center">
                <HouseIcon
                    className="h-6 w-6 cursor-pointer hover:scale-125 transition-transform duration-200 ease-out hidden md:inline-flex"

                />
                <PlusCircle
                    className="h-6 w-6 cursor-pointer hover:scale-125 transition-transform duration-200 ease-out"
                />


            </div>
          </div>
        </div>
    )
}
