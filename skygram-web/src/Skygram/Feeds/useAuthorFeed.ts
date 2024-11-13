import { Agent } from '@atproto/api';
import { useQuery } from '@tanstack/react-query';

export type UseAuthorFeedProps = {
  actor: string,
  cursor?: string,
  agent: Agent
};
const fetchAuthorFeed = async ({ actor, cursor, agent }:UseAuthorFeedProps) => {
  const { data } = await agent.getAuthorFeed({
    actor,
    filter: 'posts_with_media',
    limit: 30,
    cursor,
  });

  return data;
};

const useAuthorFeed = ({ actor, cursor, agent }:UseAuthorFeedProps) => {
  return useQuery(['authorFeed', actor, cursor], () => fetchAuthorFeed({ actor, cursor, agent }), {
    keepPreviousData: true,
  });
};

export default useAuthorFeed;
