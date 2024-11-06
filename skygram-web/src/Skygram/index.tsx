import { Agent, AppBskyFeedDefs } from "@atproto/api";
import { LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Aside from "./Aside";
import feeds, { Feed } from "./feeds";
import Header from "./Header";
import Post, { PostProps, ViewImage } from "./Post";

export type User = {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
}
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
        id: post.post.uri.split('/').slice(-1)[0],
        username: post.post.author.handle,
        displayName: post.post.author.displayName as string,
        avatar: post.post.author.avatar as string,
        author: post.post.author,
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
export default function Skygram() {
  const [currentFeed, setCurrentFeed] = useState<Feed>(feeds[0]);
  const {posts } = useFeed(currentFeed);
  const user : User = {
    username: '@Josh412.com',
    displayName: 'Josh',
    avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:payluere6eb3f6j5nbmo2cwy/bafkreighuv4achuxiytohiuldvt6l5im2t5c2zzzeqmls5d7ytiq7u7qqq@jpeg',
    id: '/did:plc:payluere6eb3f6j5nbmo2cwy'
  }

  return (
      <>
        <Header
          loggedInUser={user}
          currentFeed={currentFeed}
          setCurrentFeed={setCurrentFeed}
        />

        {/** <!-- Feed --> */}
        <main className="grid grid-cols-1 md:grid-cols-3 mx-auto md:max-w-6xl">
          <section className="md:col-span-2">
            {/** <!-- Left --> */}

            {/**             <Stories /> */}


            <>
              {posts && posts.length ? posts.map((post)=>(
                <Post {...post} key={post.id}/>
              )):<LoaderCircle
                className="animate-spin h-5 w-5 mr-3 ..."
              />}
            </>
          </section>

          <Aside
            currentFeed={currentFeed}
          />
        </main>
      </>
  )
}
