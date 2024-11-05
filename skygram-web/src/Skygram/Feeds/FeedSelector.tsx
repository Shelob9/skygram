import feeds, { Feed } from "../feeds";

interface FeedSelectorProps {
    currentFeed: Feed;
    onChangeFeed: (feed: Feed) => void;
}
function key(feed: Feed) {
    return`${feed.did}-${feed.rkey}`;
}

export default function FeedSelector({ currentFeed, onChangeFeed }: FeedSelectorProps) {
    return (
        <ul className="flex flex-wrap">
            {feeds.map(feed => {
                const isActive = currentFeed && key(feed) === key(currentFeed);
                return (
                    <li
                        key={key(feed)}
                        className={`mr-4 ${isActive ? 'border border-gray-300 rounded' : ''}`}
                    >
                        <button
                            onClick={() => onChangeFeed(feed)}
                            className={`flex items-center ${isActive ? ' font-bold' : ''}`}
                        >
                            <span className="sm:hidden">{feed.emoji}</span>
                            <span className="hidden sm:inline">{feed.emoji} {feed.label}</span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
