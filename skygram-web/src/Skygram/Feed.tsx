import { AppBskyFeedDefs } from "@atproto/api";
import { useMemo, useState } from "react";
import { useApi } from "../ApiProvider/useApi";
import feeds, { T_Feed } from "./feeds";
import FeedView from "./Feeds/FeedView";
import { fetchFeed, fetchFeedQueryKeys } from "./Feeds/useFeed";



export default function Feed() {
    const [cursor,setCursor] = useState<string|undefined>(undefined)
    const {currentFeed,agent,preferredLanguages} = useApi()
    const {did,rkey} = useMemo<T_Feed>(() => {
        return feeds.find((feed) => feed.did === currentFeed) || feeds[0]
    },[currentFeed])

    const queryKey = useMemo<Array<string|object>>(
        () => fetchFeedQueryKeys({did,rkey,cursor:undefined,preferredLanguages}),
        [did,rkey,preferredLanguages]
    )

    const queryFn = () => {
        return fetchFeed({ agent, cursor, did, rkey, preferredLanguages} ).then(
            (data:{cursor?:string,feed:AppBskyFeedDefs.FeedViewPost[]}) => {
                setCursor(data.cursor);
                return data;
            }
        )
    }
    return <FeedView queryFn={queryFn} queryKey={queryKey}/>

}
