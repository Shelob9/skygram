import { Agent, AppBskyFeedDefs } from "@atproto/api";
import { useEffect, useMemo, useState } from "react";
import Skygram from "./Skygram";
import { PostProps, ViewImage } from "./Skygram/Post";

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

  const prepared = useMemo<PostProps[]>(()=>{
    if(! posts){
      return []
    }

    return Object.keys(posts).map((_value: string, index: number)=>{
      const post = posts[index]
      if(!post.post.embed){
        return null
      }
      const embed = post.post.embed;
      const images = embed.images;
      console.log(images)
      if(!Array.isArray(images)){
          return null;
      }

      const postImages : ViewImage[] = images.map((image, ) => ({
        alt: image.alt,
        thumb: image.thumb,
        fullsize: image.fullsize,
        aspectRatio: image.aspectRatio,
              // id is between last / and last @ in image.fullsize
        id: image.fullsize.split('/').slice(-1)[0].split('@')[0],
      }))


      const preparedPost : PostProps = {
        id: post.post.cid,
        username: post.post.author.handle,
        displayName: post.post.author.displayName as string,
        avatar: post.post.author.avatar as string,

        comments: [{
          id: 0,
          username: post.post.author.handle,
          avatar: post.post.author.avatar as string,
          comment: 'Fake self comment',
          time: '5 days ago'
        }],
        postImages,
        // @ts-ignore
        time: post.post.record.createdAt,
        // @ts-ignore
        caption: post.post.record.text as string,
        index,
      }
      return preparedPost
    }).filter((post)=>post !== null) as PostProps[]
  },[posts])
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

  return {getNext,posts:prepared}
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

  return (
    <Skygram posts={posts} />
  )
}

export default App
