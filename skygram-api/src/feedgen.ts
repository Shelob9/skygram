import '@atcute/bluesky/lexicons';
import { XRPC, simpleFetchHandler } from '@atcute/client';
import { AppBskyFeedGetFeedSkeleton, AtUri } from '@atproto/api';
import { Hono, HonoRequest } from 'hono';

const xrpc = new XRPC({ handler: simpleFetchHandler({ service: 'https://api.bsky.app' }) });

import feeds from './feedData';
type Bindings = {
  baseUrl: string

}

const app = new Hono<{ Bindings: Bindings }>()
app.use('*', async (c, next) => {
  c.env.baseUrl = new URL(c.req.url).origin;
  return next()
});



app.get('/', (c) => {
  const baseUrl = c.env.baseUrl;
  return c.json({
    feeds: true,
    baseUrl,
  })
})

//make did and word dynamic
app.get('/user/did/word', async (c) => {
  const {data } = await xrpc.get('app.bsky.feed.searchPosts', {
    params: {
      q: 'Good Morning',
      limit: 10,
      author: 'did:plc:payluere6eb3f6j5nbmo2cwy',
    },
  });
  return c.json(data)
});


const parseFeedArgs = (req:HonoRequest) => {
  const did = req.param('did');
  const rkey = req.param('rkey');
  const feed = feeds.find(f => f.did === did && f.rkey === rkey);
  const cursor = req.query('cursor');
  const limit = req.query('limit');

  return {
    did: did as string,
    rkey: rkey as string,
    feed,
    cursor,
    limit: limit ? parseInt(limit as string) : 30,
  }
}
app.get('/upstream/feed/:did/:rkey', async(c) => {
  const {did,rkey,feed,cursor,limit} = parseFeedArgs(c.req);

  if(!feed){
    return c.json({error:'feed not found',rkey,did},400)
  }
  try {
    const { data } = await xrpc.get('app.bsky.feed.getFeed', {
      params: {
        feed: AtUri.make(
          did,
          'app.bsky.feed.generator',
            rkey
        ).toString(),
        limit,
        cursor,
      },
    });
    return c.json(data);
  } catch (error) {
    console.log({error})
    return c.json({error:error??'error',feed},500)
  }
});



app.get('/:did/app.bsky.feed.getFeedSkeleton/:rkey', async(c) => {
    const feed : AppBskyFeedGetFeedSkeleton.OutputSchema = {
       feed: [],
        cursor: 'string',
    };
    return c.json(feed);
});

app.get('/:did/app.bsky.feed.generator/:rkey', async(c) => {
    const serviceDid = '?';
    const {did,rkey} = parseFeedArgs(c.req);
    const feeds = [
        {
            uri: AtUri.make(
                did,
                'app.bsky.feed.generator',
                rkey
            ).toString()
        }
    ];
    return c.json({
        did: serviceDid,
        feeds,
    });
});

export default app
