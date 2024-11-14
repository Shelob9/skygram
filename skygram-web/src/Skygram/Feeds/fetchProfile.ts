import { Agent, AppBskyActorDefs } from '@atproto/api';

export type UseAuthorFeedProps = {
  actor: string,
  agent: Agent
};
 const fetchProfile = async ({ actor, agent }:UseAuthorFeedProps):Promise<AppBskyActorDefs.ProfileViewDetailed> => {
  const { data } = await agent.getProfile({
    actor,
  });

  return data;
};


export default fetchProfile;
