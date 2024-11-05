import { User } from ".";
import feeds from "./feeds";

//@ts-ignore
export default function Aside(props:{
    loggedInUser: User
}) {
    return (
        <section className="hidden md:inline-grid md:col-span-1">
            <div className="fixed w-[380px]">
              <div className="mt-14 ml-10">
                <h3 className="text-lg">
                  Feeds Used</h3>
                  <ul className="mt-4">
                    {feeds.map((feed) => (
                      <li key={feed.rkey} className="flex items-center">


                        <a href={`https://bsky.app/profile/${feed.didDisplay}/feed/${feed.rkey}`}
                          className="flex items-center"
                          rel="noreferrer"
                          target="_blank"
                        >
                          <span className="mt-4 block">
                          <span className="mr-2">{feed.emoji}</span>
                          <span>{feed.label}</span>
                          </span>
                          <span className="mt-4 block">
                            <span className="ml-4 block">
                              By: <a href={`https://bsky.app/profile/${feed.didDisplay}`}
                                    rel="noreferrer"
                                    target="_blank">
                                {feed.didDisplay}
                              </a>
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
              </div>
            </div>
          </section>
    )

}
