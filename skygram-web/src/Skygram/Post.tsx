import { AppBskyActorDefs, AppBskyEmbedDefs } from "@atproto/api";
import { HeartIcon, QuoteIcon } from "lucide-react";
import sanitizeHtml from 'sanitize-html';
import Image from "./Image";
import Images from "./Images";

function PostAuthorLink({handle,children,className}:{
  handle: string;
  children: React.ReactNode;
  className?: string;
}){
  return(
    <a
      className={className}
      href={`https://bsky.app/profile/${handle}`}
      rel="noreferrer"
      target="_blank"
    >
        {children}
    </a>
  )
}

function PostLink({url,children,className}:{
  url: string;
  children: React.ReactNode;
  className?: string;
}){
  return(
    <a
      className={className}
      href={url}
      rel="noreferrer"
      target="_blank"
    >
        {children}
    </a>
  )
}
function PostHeader({ author,avatar}:PostProps) {
  const {handle} = author;
  return (
    <PostAuthorLink
      handle={handle}
      className="flex items-center p-4"
    >
        <img
          className="h-12 rounded-full border p-1 mr-3"
          src={avatar}
          alt={`${handle} avatar`}
        />
        <p className="flex-1 font-bold">
           @{handle}
        </p>
    </PostAuthorLink>
  )
}

function PostButtons({url}:PostProps){
  return(
    <div className="flex justify-between px-4 pt-4">
      <div className="flex space-x-4">
        <PostLink url={url}>
          <HeartIcon
            className="btn hover:text-red-500 hover:scale-110"
          />
        </PostLink>
        <PostLink url={url}>
          <QuoteIcon
            className="btn hover:text-red-500 hover:scale-110"
          />
        </PostLink>
      </div>
    </div>
  )
}

const sanitizer = (input:string) => sanitizeHtml(input, {
  allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
  allowedAttributes: {
    'a': [ 'href' ]
  },
  allowedIframeHostnames: ['www.youtube.com']
});

function PostCaption({
  username,
  caption,
  author: {handle}
}:PostProps){
  return(
    <p className="p-5 truncate">
      <PostAuthorLink
        handle={handle}
      >
        <span className="font-bold mr-2">{username}</span>
      </PostAuthorLink>
      <span
        dangerouslySetInnerHTML={{__html: sanitizer(caption)}}
      />
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
  author: AppBskyActorDefs.ProfileViewBasic,
  url: string
}
export default function Post(props:PostProps){
  const {
    postImages,
    id,
  } = props;
  return (
      <>
        <div
          id={`post-${id}`}
          className="border my-7 bg-white rounded-md"
        >
          <PostHeader {...props} />
          <>
            {1 === postImages.length ? (
              <Image
                src={postImages[0].fullsize}
                alt={postImages[0].alt}
              />
            ):(
              <Images
                images={postImages.map((image)=>({
                  src: image.fullsize,
                  alt: image.alt,
                }))}
              />
            )}
          </>
          <PostButtons {...props} />
          <PostCaption {...props} />
        </div>
      </>
    )
}
