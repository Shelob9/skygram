import { useLocation } from "@tanstack/react-router";
import { useApi } from "../ApiProvider/useApi";
import AsideSection from "./AsideSection";
import feeds from "./feeds";
import Profile from "./Feeds/Profile";

//   <aside tag is in template

export default function Aside() {
    const {currentFeed} = useApi();
    const pathname = useLocation({
        select: (location) => location.pathname,
    })
    return (
        <>
            <div className="fixed w-[380px]">
                {"/" == pathname ? (
                    <AsideSection title="Feeds Used">
                        <ul className="mt-4">
                            {feeds.map((feed) => {
                                const isActive = currentFeed && feed.rkey === currentFeed.rkey;
                                return (
                                    <li
                                        key={feed.rkey}
                                        className={`mb-4 ${isActive ? "bg-gray-200 border-b border-gray-300" : ""}`}
                                    >
                                        <h3 className="font-bold">
                                            <a
                                                rel="noreferrer"
                                                target="_blank"
                                                href={`https://bsky.app/profile/${feed.didDisplay}/feed/${feed.rkey}`}
                                            >
                                                {feed.emoji} {feed.label}
                                            </a>
                                        </h3>
                                        <a
                                            href={`https://bsky.app/profile/${feed.didDisplay}`}
                                            className="ml-4 text-blue-500"
                                            rel="noreferrer"
                                            target="_blank"
                                        >
                                            {feed.displayName ? `${feed.displayName} (@${feed.didDisplay})` : `@${feed.didDisplay}`}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </AsideSection>
                ) : <AsideSection
                        title={"Josh412.com"}
                    >
                        <Profile actor="josh412.com" />
                    </AsideSection>
                }
            </div>
            {import.meta.env.MODE === "development" && (
                <div className="hidden">
                    <div className="mt-14 ml-10">
                        <h3 className="text-lg">DEV MODE</h3>
                    </div>
                </div>
            )}
        </>
    );
}
