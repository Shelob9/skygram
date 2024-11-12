import React from 'react';
import useAuthorFeed from 'path/to/hooks/useAuthorFeed'; // Update this import to the correct path

const AuthorFeed = ({ actor }) => {
  const { data, error, isLoading, isFetching, fetchNextPage } = useAuthorFeed({ actor });

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
