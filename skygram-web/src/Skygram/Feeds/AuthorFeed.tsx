import useAuthorFeed from './useAuthorFeed';

const AuthorFeed = ({ actor }:{
  actor: string
}) => {
  const { data, error, isLoading, isFetching,  } = useAuthorFeed({ actor });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.feed.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      {isFetching && <div>Loading more...</div>}
      <button onClick={() => fetchNextPage()} disabled={isFetching}>
        Load More
      </button>
    </div>
  );
};

export default AuthorFeed;
