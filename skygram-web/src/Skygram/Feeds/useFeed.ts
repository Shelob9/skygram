import { Agent } from '@atproto/api';
import { useQuery } from '@tanstack/react-query';

export type UseFeedProps = {
  agent: Agent,
  cursor?: string,
  did: string,
  rkey: string,
  preferredLanguages: string
  limit?: number
};

export const fetchFeedQueryKeys = ({ did, rkey, cursor,limit,preferredLanguages }:Omit<UseFeedProps,'agent'>) : Array<string|object> =>
  [ did, 'app.bsky.feed.generator', rkey, {cursor,preferredLanguages,limit:limit || 30}];
export const fetchFeed = async ({ agent, cursor, did, rkey, preferredLanguages }:UseFeedProps) => {
  const { data } = await agent.app.bsky.feed.getFeed(
    {
      feed: `at://${did}/app.bsky.feed.generator/${rkey}`,
      limit: 30,
      cursor,
    },
    {
      headers: {
        "Accept-Language": preferredLanguages,
      },
    }
  );

  return data;
};

const useFeed = ({ did, rkey, agent, cursor, preferredLanguages }:UseFeedProps) => {
  return useQuery(fetchFeedQueryKeys({did,rkey,cursor,preferredLanguages}), () => fetchFeed({ agent, did, rkey, cursor, preferredLanguages  }), {
    keepPreviousData: true,
  });
};

export default useFeed;
