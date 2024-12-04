import '@atcute/bluesky/lexicons';
import { XRPC, simpleFetchHandler } from '@atcute/client';
import { AtUri } from '@atproto/api';
import { Hono, HonoRequest } from 'hono';
import { cors } from 'hono/cors';
import feedgen from './feedgen';
const xrpc = new XRPC({ handler: simpleFetchHandler({ service: 'https://api.bsky.app' }) });



import feedData from './feedData';
import verifyWebhookSignature from './verifyWebhookSignature';
type Bindings = {
  baseUrl: string

}

const app = new Hono<{ Bindings: Bindings }>()
app.use('*', async (c, next) => {
  c.env.baseUrl = new URL(c.req.url).origin;
  return next()
});
const gardening = {
  did: `did:plc:5rw2on4i56btlcajojaxwcat`,
  rkey: `aaao6g552b33o`,
}

app.use('*', cors({
  origin: '*'
}));



app.get('/', (c) => {
  return c.html(`<h1>Not yet</h1>`)
})



app.get('/api/status', (c) => {
  const baseUrl = c.env.baseUrl;

  return c.json({
    not:'yet',
    oauth: `${baseUrl}/api/oauth.json`,
    baseUrl: baseUrl,
  })
})

app.post('/api/status/streamjet', async (c) => {
  const body = await c.req.text();
  const signature = c.req.header('x-signature');
  const timestamp = c.req.header('x-timestamp');
  const valid = verifyWebhookSignature({
    secret:'jr2c44ndobinz7s7by4j73hb',
    body,
    signature:signature??'',
    timestamp:timestamp??''
  })
  if(!valid){
    return c.json({ok:false,error:'invalid signature'},401)
  }
  const data = JSON.parse(body);
  console.log({signature,timestamp,valid})
  return c.json({ok:true,valid,did:data.did})
})

app.get('/api/profile', async (c) => {
  const handle = c.req.query('handle') || '@josh412.com';
  try {
    const {data } = await xrpc.get('app.bsky.actor.getProfile', {
      params: {
        handle
      },
    });
    return c.json(data)
  } catch (error) {
    //@ts-ignore
    return c.json({error:error.description},500)
  }
});
app.get('/api/handle', async (c) => {
  const handle = c.req.query('handle') || 'josh412.com';
  try {
    const { data } = await xrpc.get('com.atproto.identity.resolveHandle', {
      params: {
        handle,
      },
    });
    return c.json(data)
  } catch (error) {
    return c.json({error:error.description},500)
  }
});


app.get('/api/atcute/feed', async (c) => {
  const { data } = await xrpc.get('app.bsky.feed.getFeed', {
    params: {
      feed: AtUri.make(
        gardening.did,
        'app.bsky.feed.generator',
        gardening.rkey
      ).toString(),
    },
  });
  return c.json(data)
})

app.get('/api/atcute/search', async (c) => {
  const {data } = await xrpc.get('app.bsky.feed.searchPosts', {
    params: {
      q: 'Good Morning',
      limit: 10,
      author: 'did:plc:payluere6eb3f6j5nbmo2cwy',
    },
  });
  return c.json(data)
});

app.get('/api/oauth.json', (c) => {
  const url = c.env.baseUrl;
  return c.json({
    "client_id": `${url}/api/oauth.json`,
    "client_name": "Skygram",
    "client_uri": url,
    "logo_uri": `https://cdn.josh412.com/uploads/2024/06/macy-bear.jpg`,
    "tos_uri": `${url}/tos`,
    "policy_uri": `${url}/policy`,
    "redirect_uris": [url, `${url}/oauth`],
    "scope":'atproto transition:generic',
    "grant_types": [
      "authorization_code",
      "refresh_token"
    ],
    "response_types": ["code"],
    "token_endpoint_auth_method": "none",
    "application_type": "web",
    "dpop_bound_access_tokens": true
  })
})


app.get('/api/feeds', (c) => {
  const url  = c.env.baseUrl;

  return c.json({
    feeds:feedData.map(feed => {
      return {
        ...feed,
        posts: `${url}/api/feed/${feed.did}/${feed.rkey}`,
      }
    })
  })
})

const parseFeedArgs = (req:HonoRequest) => {
  const did = req.param('did');
  const rkey = req.param('rkey');
  const feed = feedData.find(f => f.did === did && f.rkey === rkey);
  const cursor = req.query('cursor');
  const limit = req.query('limit');

  return {
    did,
    rkey,
    feed,
    cursor,
    limit
  }
}
app.get('/api/feed/:did/:rkey', async(c) => {
  const {did,rkey,feed,cursor,limit} = parseFeedArgs(c.req);

  if(!feed){
    return c.json({error:'feed not found',rkey,did},400)
  }
  try {
    const { data } = await xrpc.get('app.bsky.feed.getFeed', {
      params: {
        feed: AtUri.make(
          feed.did,
          'app.bsky.feed.generator',
          feed.rkey
        ).toString(),
        limit: limit ? parseInt(limit) : 30,
        cursor,
      },
    });
    return c.json(data);
  } catch (error) {
    console.log({error})
    return c.json({error:error??'error',feed},500)
  }
});

//@ts-ignore
app.route('/api/feedgen',feedgen );

export default app
