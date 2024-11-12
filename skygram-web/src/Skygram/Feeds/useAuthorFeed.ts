import { useQuery } from '@tanstack/react-query'

const fetchAuthorFeed = async ({ actor, cursor, agent }) => {
  const { data } = await agent.getAuthorFeed({
    actor,
    filter: 'posts_with_media',
    limit: 30,
    cursor,
  });

  return data;
};

const useAuthorFeed = ({ actor, cursor, agent }) => {
  return useQuery(['authorFeed', actor, cursor], () => fetchAuthorFeed({ actor, cursor, agent }), {
    keepPreviousData: true,
  });
};

export default useAuthorFeed;
