import { Link, useLocation } from '@tanstack/react-router';
import { SearchIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import LoginModal from '../ApiProvider/LoginModal';
import { useApi } from "../ApiProvider/useApi";
import Bluesky from "../components/Bluesky";
import Github from "../components/Github";
import IfFlag from '../components/IfFlag';
import feeds, { T_Feed } from './feeds';
import FeedSelector from './Feeds/FeedSelector';

const logo : {
    src:string;
    alt:string;
} = {
    src: "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:payluere6eb3f6j5nbmo2cwy/bafkreie2aefqvw3bbhn75rpexgzjgbzijul2td3lmkdgo7ibpjx2svy3ou@jpeg",
    alt: "Zinnia flower. Very pink, very bloomed, but still blooming "
}



type HeaderProps = {
    //loggedInUser: User,
    currentFeed: T_Feed,
    setCurrentFeed: (feed:T_Feed) => void
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


export default function Header() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  })
  const {
    currentFeed,
    setCurrentFeed,
  } = useApi();

  const feed = useMemo<T_Feed>(() => {
    return feeds.find((f) => f.did === currentFeed) || feeds[0];
  }, [currentFeed]);
  const setFeed = useCallback((feed: T_Feed) => setCurrentFeed(feed.did), [setCurrentFeed]);

  return (
      <div className="sticky top-0 border-b shadow-sm bg-white z-30">
        {/** <!-- Header --> */}

        <div
          className="flex justify-between h-24 items-center mx-4 xl:max-w-6xl xl:mx-auto"
        >
          {/** <!-- Left  --> */}
          <div className="cursor-pointer w-24 inline-grid">
            <Link to="/">
              <img
                className="h-10 rounded-full cursor-pointer w-10 rounded-full"
                src={logo.src}
                alt={logo.alt}
              />
            </Link>
          </div>
          <div className="cursor-pointer w-24 inline-grid ">
            <Link to="/">
              <h1
                className="hidden md:inline text-2xl font-bold"
              >
                Skygram
              </h1>
            </Link>
          </div>

          {/** <!-- Middle --> */}

          <div className="relative mt-1">
            <div className="absolute top-2 left-2"
              style={{visibility:'hidden'}}
            >
              <SearchIcon />
            </div>
            {'/' === pathname ?(
            <FeedSelector
              currentFeed={feed}
              onChangeFeed={setFeed}
            />):null}
          </div>
          {/** <!-- Right --> */}
          <div className="flex space-x-4 items-center">
            <Github
              className="hover:scale-110 h-6 w-6 cursor-pointer hover:scale-125 transition-transform duration-200 ease-out inline-flex"
              href="https://github.com/shelob9/skygram"
            />
            <Bluesky
              href="https://bsky.app/profile/skygram.app"
              className="border-blue hover:scale-110 h-6 w-6 cursor-pointer hover:scale-125 transition-transform duration-200 ease-out inline-flex"
            />
            <IfFlag cookie="__josh">
              <LoginModal />
            </IfFlag>
          </div>
        </div>
      </div>
  )
}
