import { useVirtualizer } from "@tanstack/react-virtual";
import { LoaderCircle } from "lucide-react";
import { Fragment, useRef } from "react";
import { useApi } from "../ApiProvider/useApi";
import { T_Feed } from "./feeds";
import Post from "./Post";
import useFeed from "./useFeed";


export default function Feed({currentFeed}:{
    currentFeed: T_Feed
}) {
    const {did,rkey} = currentFeed
    const {agent} = useApi()
    const {postIndexes,getPost,postCount } = useFeed({did,rkey,agent})
    const parentRef = useRef<HTMLDivElement>(null)
    const rowVirtualizer = useVirtualizer({
        count: postCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
        overscan: 5,
    })

    return (
        <div>
            <div
                ref={parentRef}
                className="w-full overflow-auto"
            >
            {postIndexes && postIndexes.length ? (

                <div>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                        <div
                            key={virtualRow.index}
                            className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                        >
                            <Fragment key={virtualRow.index}>
                                <>
                                    {getPost(virtualRow.index) ? <Post {...getPost(virtualRow.index)}/> :null}
                                </>
                            </Fragment>


                        </div>
                    ))}
                </div>
            ):<LoaderCircle
                className="animate-spin h-5 w-5 mr-3 ..."
                />}
            </div>
        </div>
    )
}
