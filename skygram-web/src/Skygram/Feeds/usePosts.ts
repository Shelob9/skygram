import { AppBskyFeedDefs } from "@atproto/api";
import { PostProps, ViewImage } from "../Post";

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

export default function usePosts({posts}:{
    posts: AppBskyFeedDefs.FeedViewPost[]
  }){

    return {
      postIndexes:posts ? Object.keys(posts) : [],
      postCount:posts.length || 0,
      getPreparedPost: (index:number) => {
        if(!posts){
          return null
        }
        return preparedPost(index,posts)
      }
    }
  }
