import { Agent } from '@atproto/api';
import useAuthorFeed from './useAuthorFeed';

const AuthorFeed = ({ actor,agent }:{
  actor: string;
  agent: Agent;
}) => {
  const { data, error, isLoading, isFetching,  } = useAuthorFeed({ actor,agent });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.feed.map((post) => (
        <div key={post.post.cid}>{post.post.record.text}</div>
      ))}
      {isFetching && <div>Loading more...</div>}
      <button onClick={() => fetchNextPage()} disabled={isFetching}>
        Load More
      </button>
    </div>
  );
};

export default AuthorFeed;
