import { createLazyFileRoute } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApi } from '../ApiProvider/useApi';
import Aside from '../Skygram/Aside';
import Feed from '../Skygram/Feed';
import feeds, { T_Feed } from '../Skygram/feeds';
import FeedSelector from '../Skygram/Feeds/FeedSelector';
export const Route = createLazyFileRoute('/')({
  component: FeedRoute,
})

const HeaderCenter = () => {
  const {
    currentFeed,
    setCurrentFeed,
  } = useApi();

  const feed = useMemo<T_Feed>(() => {
    return feeds.find((f) => f.did === currentFeed) || feeds[0];
  }, [currentFeed]);
  const setFeed = useCallback((feed: T_Feed) => setCurrentFeed(feed.did), [setCurrentFeed]);

  return (
  <div className="relative mt-1">
            <div className="absolute top-2 left-2"
              style={{visibility:'hidden'}}
            >
              <SearchIcon />
            </div>

            <FeedSelector
              currentFeed={feed}
              onChangeFeed={setFeed}
            />
          </div>
  )
}

function WithAside({children}:{
  children: React.ReactNode
}) {
  const [asideElement] = useState(() => document.getElementById('main-aside'));
  return (
    <>
      {children}
      {asideElement ?createPortal(<Aside />, asideElement):null}
    </>
  )
}

function WithHeaderCenter({children}:{
  children: React.ReactNode
}) {
  const [headerElement] = useState(() => document.getElementById('header-center'));
  return (
    <>
      {children}
      {headerElement ?createPortal(<HeaderCenter />, headerElement):null}
    </>
  )
}
function FeedRoute() {
  return (
    <WithAside>
      <WithHeaderCenter>
        <Feed />
      </WithHeaderCenter>
    </WithAside>
  )
}
