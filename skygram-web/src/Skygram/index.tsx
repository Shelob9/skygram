import Aside from "./Aside";
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
        />

        {/** <!-- Feed --> */}
        <main className="grid grid-cols-1 md:grid-cols-3 mx-auto md:max-w-6xl">
          <section className="md:col-span-2">
            {/** <!-- Left --> */}

            {/**             <Stories /> */}


            <>
            {posts.map((post)=>(
              <Post {...post} key={post.id}/>
            ))}
            </>
          </section>

          <Aside
            loggedInUser={user}
          />
        </main>
      </>
  )
}
