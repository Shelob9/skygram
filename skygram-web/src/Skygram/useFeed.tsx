import { Agent, AppBskyFeedDefs, } from "@atproto/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PostProps, ViewImage } from "./Post";

async function getFeed({did, rkey, agent,cursor}:{did:string, rkey:string, agent:Agent,cursor?:string}) {
  try {
    const { data } = await agent.app.bsky.feed.getFeed(
      {
        feed: `at://${did}/app.bsky.feed.generator/${rkey}`,
        limit: 30,
        cursor,
      },
    );
    return data
  } catch (error) {
    console.error({error})
  }
}

const preparedPost = (index:number,posts:AppBskyFeedDefs.FeedViewPost[]) => {
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

  const rkey = post.post.uri.split('/').slice(-1)[0];
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
    url: `https://bsky.app/profile/${post.post.author.handle}/post/${rkey}`
  }
  return preparedPost;
}

export default function useFeed({did,rkey,agent}:{
    did:string,
    rkey:string,
    agent:Agent
  }) {

    const [cursor, setCursor] = useState<string|undefined>(undefined);
    const [nextCursor, setNextCursor] = useState<string|undefined>(undefined);

    const {data} = useQuery({
      queryKey: [did,'app.bsky.feed.generator',rkey,cursor],
      queryFn: () => getFeed({did,rkey,agent,cursor})
    })
    console.log({data,cursor})

    function getNext(){
      setCursor(nextCursor)
    }

    return {
        getNext,
        postIndexes:data?.feed ? Object.keys(data.feed) : [],
        postCount:data?.feed.length || 0,
        getPost: (index:number) => {
          if(!data?.feed){
            return null
          }
          return preparedPost(index,data.feed)
        }
    }
}
