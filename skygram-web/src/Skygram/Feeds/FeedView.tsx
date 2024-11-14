import { AppBskyFeedDefs } from "@atproto/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { LoaderCircleIcon } from "lucide-react";
import { Fragment, useMemo, useRef } from "react";
import Centered from "../../components/Centered";
import Post from "../Post";
import usePosts from "./usePosts";


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

export type FeedQueryResult = {
    feed: AppBskyFeedDefs.FeedViewPost[];
    cursor?: string;
};
export default function FeedView({
    queryFn,
    queryKey,
}:{
    queryFn: (ctx:{
        pageParam?:string
    })  => Promise<FeedQueryResult>
    queryKey:Array<string|object>
}   ) {

    const {
        status,
        data,
        error,
        isFetching,
        fetchNextPage,
        hasNextPage,
      } = useInfiniteQuery({
        queryKey,
        //@ts-ignore
        queryFn,
        getNextPageParam: (lastGroup) => {
            return lastGroup.cursor;
        },
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
