import { AppBskyFeedDefs } from "@atproto/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useApi } from "../ApiProvider/useApi";
import Aside from "./Aside";
import feeds, { T_Feed } from "./feeds";
import FeedView from "./Feeds/FeedView";
import { fetchFeed, fetchFeedQueryKeys } from "./Feeds/useFeed";
import Header from "./Header";



export default function Feed() {
    const headerRef = useRef<HTMLDivElement>(null);
    const asideRef = useRef<HTMLDivElement>(null);
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

    useEffect(() => {
        const headerElement = document.getElementById('skygram-header');
        if (headerElement) {
            headerRef.current = headerElement;
        }
    }, []);

    useEffect(() => {
        const asideElement = document.getElementById('skygram-main-aside');
        if (asideElement) {
            asideRef.current = asideElement;
        }
    }, []);



    return (
        <>
            {headerRef.current && createPortal(<Header />, headerRef.current)}
            {asideRef.current && createPortal(<Aside />, asideRef.current)}
            <FeedView queryFn={queryFn} queryKey={queryKey} />
        </>
    );

}
