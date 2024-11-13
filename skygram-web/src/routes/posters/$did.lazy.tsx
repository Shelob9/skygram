import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useApi } from '../../ApiProvider/useApi'
import { fetchAuthorFeed } from '../../Skygram/Feeds/useAuthorFeed'

export const Route = createLazyFileRoute('/posters/$did')({
  component: RouteComponent,
})

function RouteComponent() {
  const { did } = Route.useParams()
  const {agent } = useApi()
  const cursor = undefined;
  const { data, error, isLoading, isFetching,  } = useQuery({
    queryKey: ['getAuthorFeed', did, cursor, {
      filter: 'posts_with_media',
      limit: 30,
      cursor,
    }],
    queryFn: () => fetchAuthorFeed({ actor:did, cursor, agent }),
    enabled: !!agent,
  })


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <>
    {data?.feed.map((post) => (
      <div key={post.post.cid}>{post.post.record.text}</div>
    ))}
  </>
}
