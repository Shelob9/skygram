import { AppBskyFeedDefs } from "@atproto/api";
import { useMemo, useState } from "react";
import { useApi } from "../ApiProvider/useApi";
import Aside from "./Aside";
import feeds, { T_Feed } from "./feeds";
import FeedView from "./Feeds/FeedView";
import { fetchFeed, fetchFeedQueryKeys } from "./Feeds/useFeed";
import Header from "./Header";
import PortalAreas from "./PortalAreas";

const FeedsUsedSide = () => {
    const {currentFeed} = useApi();
    return (
        <Aside title="Feeds Used">
            <>
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

    const [cursor,setCursor] = useState<string|undefined>(undefined)
    const {currentFeed,xrpc,preferredLanguages} = useApi()
    const {did,rkey} = useMemo<T_Feed>(() => {
        return feeds.find((feed) => feed.did === currentFeed) || feeds[0]
    },[currentFeed])

    const queryKey = useMemo<Array<string|object>>(
        () => fetchFeedQueryKeys({did,rkey,cursor:undefined,preferredLanguages}),
        [did,rkey,preferredLanguages]
    )

    const queryFn = () => {
        return fetchFeed({ xrpc, cursor, did, rkey, preferredLanguages} ).then(
            (data:{cursor?:string,feed:AppBskyFeedDefs.FeedViewPost[]}) => {
                setCursor(data.cursor);
                return data;
            }
        )
    }

    return (
        <>
            <PortalAreas Header={() =><Header />} Aside={FeedsUsedSide} />
            <FeedView queryFn={queryFn} queryKey={queryKey} />
        </>
    );

}
