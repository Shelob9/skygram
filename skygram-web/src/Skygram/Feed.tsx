import { Agent } from "@atproto/api";
import { LoaderCircle } from "lucide-react";
import { Fragment } from "react";
import Virtual from "../components/Virtual";
import Post from "./Post";
import useFeed from "./useFeed";
export default function Feed({did,rkey,agent}:{
    did:string,
    rkey:string,
    agent: Agent
}) {
    const {postIndexes,getPost,postCount } = useFeed({did,rkey,agent})
    return (
        <>

            <>
            {postIndexes && postIndexes.length ? (
                <>
                    <Virtual
                        count={postCount}
                        Item={({index})=> {
                            const post = getPost(index);
                            return <Fragment key={index}>
                                {post ? <Post {...post}/> :null}
                            </Fragment>
                        }}
                    />
                </>
            ):<LoaderCircle
                className="animate-spin h-5 w-5 mr-3 ..."
                />}
            </>

        </>
    )
}
