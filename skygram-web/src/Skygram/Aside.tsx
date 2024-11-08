import feeds, { T_Feed } from "./feeds";

export default function Aside({ currentFeed }: { currentFeed?: T_Feed }) {
    return (
        <section className="hidden md:inline-grid md:col-span-1">
            <div className="fixed w-[380px]">
                <div className="mt-14 ml-10">
                    <h3 className="text-lg">Feeds Used</h3>
                    <ul className="mt-4">
                        {feeds.map((feed) => {
                            const isActive = currentFeed && feed.rkey === currentFeed.rkey;
                            return (
                                <li
                                    key={feed.rkey}
                                    className={`mb-4 ${isActive ? "border-b border-gray-300" : ""}`}
                                >
                                    <div className="font-bold">
                                        <a
                                            rel="noreferrer"
                                            target="_blank"
                                            href={`https://bsky.app/profile/${feed.didDisplay}/feed/${feed.rkey}`}
                                        >
                                            {feed.emoji} {feed.label}
                                        </a>
                                    </div>
                                    <a
                                        href={`https://bsky.app/profile/${feed.didDisplay}`}
                                        className="text-blue-500"
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        {feed.displayName ? `${feed.displayName} (@${feed.didDisplay})` : `@${feed.didDisplay}`}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}
