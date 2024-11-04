import { AppBskyEmbedDefs, AppBskyEmbedExternal, AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyEmbedVideo, AppBskyFeedDefs } from "@atproto/api"
import { useState } from "react"
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
function EmbedImage({image}:{
    image: ViewImage
}){
    return (
        <img src={image.fullsize} alt={image.alt}

        />
    )
}
function EmbedImages({embed}:{
    embed: AppBskyEmbedImages.View
}){
    return (
        <div>
            {embed.images.map((image, index) => (
                <EmbedImage key={index} image={image} />
            ))}
        </div>
    )
}
function Embed({embed}:{
    embed: | AppBskyEmbedImages.View
    | AppBskyEmbedVideo.View
    | AppBskyEmbedExternal.View
    | AppBskyEmbedRecord.View
    | AppBskyEmbedRecordWithMedia.View
    | { $type: string; [k: string]: unknown }
}) {

    const images = embed.images;
    console.log(images)
    if(Array.isArray(images)){
        return <EmbedImage  image={images[0]} />
    }
    return null;

}






export function blueskyPostUriToUrl(uri:string,authorHandle:string){
    //take only the part after app.bsky.feed.post/ in uri
    uri = uri.split('/').slice(-1)[0];
    return `https://bsky.app/profile/${authorHandle}/post/${uri}`;

}

export default function Post({post}:{
    post: AppBskyFeedDefs.FeedViewPost
}) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const images = post.post.embed?.images?.images || []
    const onPrev = () => {
        if(selectedIndex === 0){
            //set to last image
            return setSelectedIndex(images.length - 1)
        }else {
            setSelectedIndex(selectedIndex - 1)
        }
    }
    const onNext = () => {
        if(selectedIndex === images.length - 1){
            //set to first image
            return setSelectedIndex(0)
        }else {
            setSelectedIndex(selectedIndex + 1)
        }
    }
    if(!post.post.embed){
        return null
    }

    const authorURl = `https://bsky.app/profile/${post.post.author.handle}`
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
                    <Embed embed={post.post.embed} />
            </div>
            <div className="flex gap-4">
                <div className=" w-1/3">
                <a href={authorURl}
                        target="_blank"
                        rel="noreferrer"
                        >
                    <img
                        className="w-8 h-8 border-black rounded-full"
                    src={post.post.author.avatar} alt={`${post.post.author.displayName} avatar`} />
                </a>
                </div>
                <div className=" w-2/3">
                    <a href={authorURl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-blue-500 hover:underline"
                    >{post.post.author.displayName}</a>
                </div>
            </div>

        </div>

    )

}
