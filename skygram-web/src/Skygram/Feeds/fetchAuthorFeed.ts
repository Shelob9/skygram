import { Agent } from '@atproto/api';

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


export default fetchAuthorFeed;
