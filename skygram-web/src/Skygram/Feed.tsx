import { AppBskyFeedDefs } from "@atproto/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { LoaderCircleIcon } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { useApi } from "../ApiProvider/useApi";
import Centered from "../components/Centered";
import feeds, { T_Feed } from "./feeds";
import { fetchFeed, fetchFeedQueryKeys } from "./Feeds/useFeed";
import usePosts from "./Feeds/usePosts";
import Post from "./Post";


function FeedPost({index,getPreparedPost}:{
    index:number,
    getPreparedPost:(index:number) => AppBskyFeedDefs.FeedViewPost | null
}) {
    const post = getPreparedPost(index)
    if(!post){
        return null
    }
    // @ts-ignore
    return <Post {...post}/>
}

export default function Feed() {
    const {currentFeed} = useApi()
    const {did,rkey} = useMemo<T_Feed>(() => {
        return feeds.find((feed) => feed.did === currentFeed) || feeds[0]
    },[currentFeed])
    const {agent,preferredLanguages} = useApi()

    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
      } = useInfiniteQuery({
        queryKey: fetchFeedQueryKeys({did,rkey,cursor:undefined,preferredLanguages}),
        //@ts-ignore
        queryFn: async (ctx) => {
            return fetchFeed({ agent, cursor:ctx.pageParam, did, rkey, preferredLanguages} ).then(
                (data:{cursor?:string,feed:AppBskyFeedDefs.FeedViewPost[]}) => {
                   return data;
                }
            )
        },
        getNextPageParam: (lastGroup) => lastGroup.cursor,
        initialPageParam: undefined,
    })
    const flatData = useMemo<AppBskyFeedDefs.FeedViewPost[]>(() => {
        // @ts-ignore
        return data ? data.pages.flatMap((page:{cursor?:string,feed:AppBskyFeedDefs.FeedViewPost[]}) => page.feed) : [];
    }, [data])
    const {getPreparedPost} = usePosts({posts:flatData});
    const parentRef = useRef<HTMLDivElement>(null)
    const rowVirtualizer = useVirtualizer({
        count: hasNextPage ? flatData.length + 1 : flatData.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        overscan: 5,

    })
    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

        if (!lastItem) {
          return
        }

        if (
          lastItem.index >= flatData.length - 1 &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage()
        }
      }, [hasNextPage, fetchNextPage, isFetchingNextPage, rowVirtualizer, flatData.length])


    if('error' === status){
        return <span>Error: {error.message}</span>
    }
    return(
        <>
            <div
                ref={parentRef}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const isLoaderRow = virtualRow.index > flatData.length - 1

                        return (
                            <div
                                key={virtualRow.index}
                            >
                            {isLoaderRow
                                ? hasNextPage
                                ? (
                                    <Centered>
                                        <button
                                            className="bg-blue text-white text-2xl rounded p-2 px-4  items-center"
                                            disabled={isFetching}
                                            onClick={()=>{
                                                fetchNextPage()
                                            }}>
                                            {isFetching ?(
                                                <LoaderCircleIcon
                                                    className="h-6 w-6 animate-spin"
                                                />

                                            ):'Load More'}
                                        </button>
                                    </Centered>
                                )
                                : <Centered>
                                    <div className="text-2xl">Done</div>
                                  </Centered>
                                : <>
                                    <Fragment key={virtualRow.index}>
                                        <FeedPost
                                            index={virtualRow.index}
                                            getPreparedPost={getPreparedPost}
                                        />
                                    </Fragment>
                                </>}
                            </div>
                    )
                    })}
                </div>
            </div>
        </>
    )

}
