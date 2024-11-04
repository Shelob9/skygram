import { AppBskyEmbedDefs } from "@atproto/api";
import { HeartIcon, QuoteIcon } from "lucide-react";

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
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      </div>
  )
}

function PostButtons(){
  return(
    <div className="flex justify-between px-4 pt-4">
      <div className="flex space-x-4">
        <HeartIcon
          className="btn"
        />
        <QuoteIcon
        className="btn"

      />

      </div>

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
  postImages,
  id,
}:PostProps){
    return (
        <>
          <div
            id={`post-${id}`}
            className="border my-7 bg-white rounded-md"
          >
            <PostHeader username={username} avatar={avatar}/>
            <a href={`#post-${id}`}>
            <img
              className="w-full object-cover"
              //            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80"

              src={postImages[0].fullsize}
              alt={postImages[0].alt}
            />
            </a>

            <PostButtons/>
            <PostCaption username={username} caption={caption}/>
            <form className="flex items-center p-4">

            </form>
          </div>
        </>
    )
}
