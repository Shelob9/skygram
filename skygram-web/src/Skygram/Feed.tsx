import { Agent } from "@atproto/api";
import { LoaderCircle } from "lucide-react";
import { Fragment } from "react";
import Post from "./Post";
import useFeed from "./useFeed";
export default function Feed({did,rkey,agent}:{
    did:string,
    rkey:string,
    agent: Agent
}) {
    const {postIndexes,getPost } = useFeed({did,rkey,agent})
    return (
        <>
        {postIndexes && postIndexes.length ? postIndexes.map((postIndex)=>{
          const post = getPost(parseInt(postIndex));
          return (
            <Fragment key={postIndex}>
              {post ? <Post {...post}/> :null}
            </Fragment>
          )
        }):<LoaderCircle
          className="animate-spin h-5 w-5 mr-3 ..."
        />}
      </>
    )
}
