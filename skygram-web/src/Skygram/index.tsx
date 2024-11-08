import { Agent } from "@atproto/api";
import { useState } from "react";
import Aside from "./Aside";
import Feed from "./Feed";
import feeds, { T_Feed } from "./feeds";
import Header from "./Header";

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


export default function Skygram() {
  const [currentFeed, setCurrentFeed] = useState<T_Feed>(feeds[0]);
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
            <Feed
              agent={agent}
              did={currentFeed.did}
              rkey={currentFeed.rkey}
            />
          </section>
          <Aside
            currentFeed={currentFeed}
          />
        </main>
      </>
  )
}
