import { Agent, AppBskyFeedDefs } from "@atproto/api";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Post from "./components/Post";
import Virtual from "./components/Virtual";

const agent = new Agent({
  service:
    "https://api.bsky.app",
});

function useFeed({did,rkey}:{
  did:string,
  rkey:string
}) {

  const [cursor, setCursor] = useState<string|undefined>(undefined);
  const [nextCursor, setNextCursor] = useState<string|undefined>(undefined);
  // {postUri: post}
  const [posts, setPosts] = useState<{[key:number]:AppBskyFeedDefs.FeedViewPost}>({});

  useEffect(() => {
    const getFeed = async() => {
      try {
        const { data } = await agent.app.bsky.feed.getFeed(
          {
            feed: `at://${did}/app.bsky.feed.generator/${rkey}`,
            limit: 30,
            cursor,
          },
        );
        setPosts((prev)=>{
          return {
            ...prev,
            ...data.feed,
          }
        })
        setNextCursor(data.cursor)
      } catch (error) {
        console.error({error})
      }
    }
    getFeed()
  },[cursor,did,rkey])

  function getNext(){
    setCursor(nextCursor)
  }

  return {getNext,posts}
}
const gardening = {
  did: `did:plc:5rw2on4i56btlcajojaxwcat`,
  rkey: `aaao6g552b33o`,
}
function App() {

  const {posts} = useFeed({

    did: gardening.did,
    rkey: gardening.rkey,
  })
  console.log({posts})

  return (
    <Layout
      CenterTop={() => <div>CenterTop</div>}
      Left={() => <div>Left</div>}
      Right={() => <div>Right</div>}
    >

      <Virtual
        count={Object.keys(posts).length}
        Item={({index}) => {
          const post = posts[index]
          return (
            <Post post={post} />
          )
        }}
      />
    </Layout>
  )
}

export default App
