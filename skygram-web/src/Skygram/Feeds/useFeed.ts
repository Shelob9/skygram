import { XRPC } from '@atcute/client';
import { AtUri } from '@atproto/api';


export type UseFeedProps = {
  xrpc: XRPC,
  cursor?: string,
  did: string,
  rkey: string,
  preferredLanguages: string
  limit?: number,
  uri?: string,
};

export const fetchFeedQueryKeys = ({ uri,did, rkey, cursor,limit,preferredLanguages }:Omit<UseFeedProps,'agent'>) : Array<string|object> =>
  uri ? [uri,{cursor,preferredLanguages,limit:limit || 30}]:[ did, 'app.bsky.feed.generator', rkey, {cursor,preferredLanguages,limit:limit || 30}];

export const fetchFeed = async ({ uri,xrpc, cursor, did, rkey, preferredLanguages }:UseFeedProps) => {
  const {data} = await xrpc.get('app.bsky.feed.getFeed', {
    params: {
      feed: uri ?? AtUri.make(
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
  return data;
};
