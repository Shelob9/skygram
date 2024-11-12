import { useQuery } from '@tanstack/react-query';

const fetchFeed = async ({ agent, cursor, did, rkey, preferredLanguages }) => {
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

const useFeed = ({ did, rkey, agent, cursor, preferredLanguages }) => {
  return useQuery(['feed', did, rkey, cursor], () => fetchFeed({ agent, did, rkey, cursor, preferredLanguages  }), {
    keepPreviousData: true,
  });
};

export default useFeed;
