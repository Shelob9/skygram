import { AppBskyFeedDefs } from '@atproto/api'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useCallback, useMemo, useState } from 'react'
import { useApi } from '../../ApiProvider/useApi'
import FeedView from '../../Skygram/Feeds/FeedView'
import fetchAuthorFeed from '../../Skygram/Feeds/fetchAuthorFeed'

export const Route = createLazyFileRoute('/posters/$actor')({
  component: RouteComponent,
})

function RouteComponent() {
  const { actor } = Route.useParams()
  const {agent } = useApi()
  const [cursor,setCursor] = useState<string|undefined>(undefined)

  const queryKey = useMemo<Array<string|object>>(
      () => [
        'getAuthorFeed',
         actor,
        {
          filter: 'posts_with_media',
          limit: 30,
        }
      ],
      [actor,]
  )

  const queryFn = useCallback(() => {
      return fetchAuthorFeed({ actor, cursor, agent, }).then(
          (data:{cursor?:string,feed:AppBskyFeedDefs.FeedViewPost[]}) => {
            if( data.cursor != cursor ) {
              setCursor(data.cursor);
            }
            return data;
          }
      )
  }, [actor, cursor, agent]);
  return <FeedView queryFn={queryFn} queryKey={queryKey}/>
}
