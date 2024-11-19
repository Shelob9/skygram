import '@atcute/bluesky/lexicons';
import { XRPC, simpleFetchHandler } from '@atcute/client';
import { AtUri } from '@atproto/api';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const xrpc = new XRPC({ handler: simpleFetchHandler({ service: 'https://api.bsky.app' }) });



import feeds from './feeds';

const app = new Hono()
const url = `https://skygram.app`
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
app.get('/api', (c) => {
  return c.json({
    not:'yet',
    oauth: `${url}/api/oauth.json`
  })
})





app.get('/api/status', (c) => {
  return c.json({
    not:'yet',
    oauth: `${url}/api/oauth.json`
  })
})

app.get('/api/atcute', async (c) => {
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

app.get('/api/oauth.json', (c) => {
  return c.json({
    "client_id": `${url}/api/oauth.json`,
    "client_name": "Skygram",
    "client_uri": url,
    "logo_uri": `https://cdn.josh412.com/uploads/2024/06/macy-bear.jpg`,
    "tos_uri": `${url}/tos`,
    "policy_uri": `${url}/policy`,
    "redirect_uris": [url],
    "scope": "atproto",
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code"],
    "token_endpoint_auth_method": "none",
    "application_type": "web",
    "dpop_bound_access_tokens": true
  })
})


app.get('/api/feeds', (c) => {
  return c.json({
    feeds:feeds.map(feed => {
      return {
        ...feed,
        posts: `${url}/api/feeds/${feed.did}/${feed.rkey}`
      }
    })
  })
})
app.get('/api/feeds/:did/:rkey', async(c) => {
  const did = c.req.param('did');
  const rkey = c.req.param('rkey');
  const feed = feeds.find(f => f.did === did && f.rkey === rkey);
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
      },
    });
    return c.json(data);
  } catch (error) {
    console.log({error})
    return c.json({error:error??'error',feed},500)
  }
});



export default app
