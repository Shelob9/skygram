import { AppBskyFeedDefs } from "@atproto/api";
import { useCallback, useMemo, useState } from "react";
import { useApi } from "../ApiProvider/useApi";
import Aside from "./Aside";
import feeds, { T_Feed } from "./feeds";
import FeedSelector from "./Feeds/FeedSelector";
import FeedView from "./Feeds/FeedView";
import { fetchFeed } from "./Feeds/useFeed";
import Header from "./Header";
import PortalAreas from "./PortalAreas";
import { useBlueskyFeeds } from "./useSkygramFeeds";

const FeedsUsedSide = () => {
    const {currentFeed,isLoggedIn,loggedInUser} = useApi();
    return (
        <Aside title="Feeds Used">
            <>
               {isLoggedIn ?  <h3>For {loggedInUser?.displayName ?? loggedInUser?.handle }</h3>:null}
                <ul className="mt-4">
                    {feeds.map((feed) => {
                        const isActive = currentFeed && feed.rkey === currentFeed.rkey;
                        return (
                            <li
                                key={feed.rkey}
                                className={`mb-4 ${isActive ? "bg-gray-200 border-b border-gray-300" : ""}`}
                            >
                                <h3 className="font-bold">
                                    <a
                                        rel="noreferrer"
                                        target="_blank"
                                        href={`https://bsky.app/profile/${feed.didDisplay}/feed/${feed.rkey}`}
                                    >
                                        {feed.emoji} {feed.label}
                                    </a>
                                </h3>
                                <a
                                    href={`https://bsky.app/profile/${feed.didDisplay}`}
                                    className="ml-4 text-blue-500"
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    {feed.displayName ? `${feed.displayName} (@${feed.didDisplay})` : `@${feed.didDisplay}`}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </>
        </Aside>
    )
}


export default function Feed() {

    const {currentFeed,setCurrentFeed,xrpc,preferredLanguages,loggedInUser,isLoggedIn} = useApi()
    const {subscribedFeeds } = useBlueskyFeeds({xrpc,did:loggedInUser?.did ?? ''});
    const feedsToSelectFrom = useMemo(() => {
        if(isLoggedIn && subscribedFeeds && subscribedFeeds.length > 0){
            return subscribedFeeds;
        }
        return feeds;
    },[isLoggedIn,subscribedFeeds])
    const {rkey,uri,did:feedDid} = useMemo<T_Feed>(() => {

        return feedsToSelectFrom.find((feed) => feed.did === currentFeed) || feeds[0]
    },[currentFeed, feedsToSelectFrom])
    const [cursor,setCursor] = useState<string|undefined>(undefined)

    const queryKey = useMemo<Array<string|object>>(
        () => [uri,feedDid, rkey, {cursor,preferredLanguages}],
        [uri, feedDid, rkey, cursor, preferredLanguages]
    )
    const queryFn = useCallback(() => {
        if(!xrpc||!uri){
            return [];
        }
        console.log({uri});
        return fetchFeed({
            xrpc,
            cursor,
            did:feedDid,
            rkey,
            uri,
            preferredLanguages
        } ).then(
            (data:{cursor?:string,feed:AppBskyFeedDefs.FeedViewPost[]}) => {
                setCursor(data.cursor);
                return data;
            }
        )
    },[xrpc,uri,feedDid,rkey,cursor,preferredLanguages])

    return (
        <>
            <PortalAreas Header={() =>
                <Header>
                    <FeedSelector
                        feeds={feedsToSelectFrom}
                        currentFeed={currentFeed}
                        onChangeFeed={(feed) => {
                            setCurrentFeed(feed.did);
                        }}
                    />
                </Header>
            } Aside={FeedsUsedSide} />
            <FeedView queryFn={queryFn} queryKey={queryKey} />
        </>
    );

}
