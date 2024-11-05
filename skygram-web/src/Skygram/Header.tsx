import { HouseIcon, PlusCircle, SearchIcon } from "lucide-react";
import { User } from ".";
import { Feed } from './feeds';
import FeedSelector from './Feeds/FeedSelector';

const logo : {
    src:string;
    alt:string;
} = {
    src: "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:payluere6eb3f6j5nbmo2cwy/bafkreie2aefqvw3bbhn75rpexgzjgbzijul2td3lmkdgo7ibpjx2svy3ou@jpeg",
    alt: "Zinnia flower. Very pink, very bloomed, but still blooming "
}



type HeaderProps = {
    loggedInUser: User,
    currentFeed: Feed,
    setCurrentFeed: (feed:Feed) => void
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
    currentFeed,
    setCurrentFeed,
}:HeaderProps) {

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
              <FeedSelector
                currentFeed={currentFeed}
                onChangeFeed={setCurrentFeed}
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
