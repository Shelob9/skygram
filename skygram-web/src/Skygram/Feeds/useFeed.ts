import { XRPC } from '@atcute/client';
import { AtUri } from '@atproto/api';


export type UseFeedProps = {
  xrpc: XRPC,
  cursor?: string,
  did: string,
  rkey: string,
  preferredLanguages: string
  limit?: number
};

export const fetchFeedQueryKeys = ({ did, rkey, cursor,limit,preferredLanguages }:Omit<UseFeedProps,'agent'>) : Array<string|object> =>
  [ did, 'app.bsky.feed.generator', rkey, {cursor,preferredLanguages,limit:limit || 30}];

export const fetchFeed = async ({ xrpc, cursor, did, rkey, preferredLanguages }:UseFeedProps) => {
  const {data} = await xrpc.get('app.bsky.feed.getFeed', {
    params: {
      feed: AtUri.make(
        did,
        'app.bsky.feed.generator',
        rkey
      ).toString(),
      limit: 30,
      cursor,
    },
    headers: {
      "Accept-Language": preferredLanguages,
    },
  }).catch((error) => {
    console.log({error})
    throw error;
  });
  console.log({data});
  return data;
};
