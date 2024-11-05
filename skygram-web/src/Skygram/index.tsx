import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import Aside from "./Aside";
import feeds, { Feed } from "./feeds";
import Header from "./Header";
import Post, { PostProps } from "./Post";

export type User = {
  username: string;
  displayName: string;
  avatar: string;
  id: string;
}
export default function Skygram({posts}:{
  posts:PostProps[]
}) {
  const [currentFeed, setCurrentFeed] = useState<Feed>(feeds[0]);

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
            loggedInUser={user}
          />
        </main>
      </>
  )
}
