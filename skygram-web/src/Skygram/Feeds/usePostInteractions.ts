import { Agent } from '@atproto/api';
import { useMutation, } from '@tanstack/react-query';

const usePostInteractions = ({ cid, uri, agent }:{
  cid: string;
  uri: string;
  agent:Agent;
}) => {
  const queryClient = useQueryClient();
  const likeMutation = useMutation(
    () => agent.like(uri, cid),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['postInteractions', uri, cid]);
      },
    }
  );

  const deleteRepostMutation = useMutation(
    () => agent.deleteRepost(uri),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['postInteractions', uri, cid]);
      },
    }
  );

  const repostMutation = useMutation(
    () => agent.repost(uri, cid),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['postInteractions', uri, cid]);
      },
    }
  );

  return {
    like: likeMutation.mutate,
    deleteRepost: deleteRepostMutation.mutate,
    repost: repostMutation.mutate,
    likeStatus: likeMutation.status,
    deleteRepostStatus: deleteRepostMutation.status,
    repostStatus: repostMutation.status,
  };
};

export default usePostInteractions;
