import { T_Feed } from "../feeds";

interface FeedSelectorProps {
    currentFeed: T_Feed;
    onChangeFeed: (feed: T_Feed) => void;
    feeds: T_Feed[];
}
function key(feed: T_Feed) {
    return`${feed.did}-${feed.rkey}`;
}

export default function FeedSelector({ feeds,currentFeed, onChangeFeed }: FeedSelectorProps) {
    return (
        <ul className="flex flex-wrap">
            {feeds ? feeds.map(feed => {
                const isActive = currentFeed && key(feed) === key(currentFeed);
                return (
                    <li
                        key={key(feed)}
                        className={`mr-4 ${isActive ? 'border border-gray-300 rounded' : ''}`}
                    >
                        <button
                            onClick={() => onChangeFeed(feed)}
                            className={`hover:scale-110 flex items-center ${isActive ? ' font-bold' : ''}`}
                        >
                            <span className="sm:hidden">{feed.emoji}</span>
                            <span className="hidden sm:inline">{feed.emoji} {feed.label}</span>
                        </button>
                    </li>
                );
            }):null}
        </ul>
    );
}
