import { AppBskyEmbedDefs } from "@atproto/api";

function PostHeader({ username,avatar}:{
  username: string;
  avatar: string;
}) {
  return (
    <div className="flex items-center p-5">
        <img
          className="h-12 rounded-full border p-1 mr-3"
          src={avatar}
          alt={`${username} avatar`}
        />
        <p className="flex-1 font-bold">
          {username}
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      </div>
  )
}

function PostImage({ username,image }: {
    username: string;
    image:ViewImage[]
 }) {
  return (
    <div className="flex items-center p-5">
          <img
            className="h-12 rounded-full border p-1 mr-3"
            src={src}
            alt={alt}
          />
          <p className="flex-1 font-bold">
            {username}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </div>
  )
}

function PostButtons({}:{

}){
  return(
    <div className="flex justify-between px-4 pt-4">
      <div className="flex space-x-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="btn"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="btn"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="btn rotate-45 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="btn"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </div>
  )
}

function PostCaption({
  username,
  caption
}:{
  username: string;
  caption: string;
}){
  return(
    <p className="p-5 truncate">
          <span className="font-bold mr-2">{username}</span>
          {caption}
    </p>
  )
}


type CommentProps = {
  username: string;
  avatar: string;
  comment: string;
  time: string;
  id: number;

};
function Comment({username,avatar,comment,time,id}:CommentProps){

  return(
    <div className="flex items-center space-x-2 mb-2">
        <img
          className="h-7 rounded-full object-cover"
          src={avatar}
          alt="user-image"
        />
        <p className="font-semibold">{username}</p>
        <p className="flex-1 truncate">{comment}</p>
        <p>{time}</p>
    </div>
  )
}
function PostComments({comments}:{
  comments: CommentProps[];
}){
  return(
    <div className="mx-10 max-h-24 overflow-y-scroll scrollbar-none">
        {comments.map((comment)=>(
          <Comment {...comment} key={comment.id}/>
        ))}
    </div>
  )
}
export interface ViewImage {
  /** Fully-qualified URL where a thumbnail of the image can be fetched. For example, CDN location provided by the App View. */
  thumb: string
  /** Fully-qualified URL where a large version of the image can be fetched. May or may not be the exact original blob. For example, CDN location provided by the App View. */
  fullsize: string
  /** Alt text description of the image, for accessibility. */
  alt: string
  aspectRatio?: AppBskyEmbedDefs.AspectRatio
  [k: string]: unknown
}
export type PostProps = {
  username: string;
  displayName: string;
  avatar: string;
  caption: string;
  comments: CommentProps[];
  postImages:ViewImage[]
  id: string;
  time: string;
  index: number;
}
export default function Post({
  username,
  avatar,
  caption,
  comments,
  postImages,
  id,
  time
}:PostProps){
    return (
        <>
          <div
            id={`post-${id}`}
            className="border my-7 bg-white rounded-md"
          >
            <PostHeader username={username} avatar={avatar}/>
            <img
            className="w-full object-cover"
            //            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80"

            src={postImages[0].fullsize}
            alt={postImages[0].alt}
          />

            <PostButtons/>
            <PostCaption username={username} caption={caption}/>
            <PostComments comments={comments}/>
            <form className="flex items-center p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <input
                className="border-none flex-1 focus:ring-0"
                type="text"
                placeholder="Enter your comment"
              />
              <button className="font-bold text-blue-400">Post</button>
            </form>
          </div>
        </>
    )
}
