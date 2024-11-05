import { Agent } from '@atproto/api';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import feeds, { getFeedPosts } from './feeds';

const app = new Hono()
const url = `https://skygram.app`

function makeAgent(){
  const agent = new Agent({
    service: 'https://api.bsky.app'
  })
  return agent;
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
        posts: `${url}/api/posts?did=${feed.did}&rkey=${feed.rkey}`
      }
    })
  })
})
app.get('/api/posts', async(c) => {
  const did = c.req.query('did');
  const rkey = c.req.query('rkey');
  const feed = ! did && !rkey ? feeds[0] : feeds.find(f => f.did === did && f.rkey === rkey);
  if(!feed ){
    return c.json({error:'feed not found',rkey,did},400)
  }

  const gardening = {
    did: `did:plc:5rw2on4i56btlcajojaxwcat`,
    rkey: `aaao6g552b33o`,
  }

  const agent = makeAgent();
  try {
    const data = await getFeedPosts(feed,agent);

    const posts = data.feed;
    const nextCursor = data.cursor;
    return c.json({nextCursor,posts,feed:{
      rkey,did
    }})
  } catch (error) {
      console.error({error,feed})
      return c.json({error,feed,at:`at://${feed.did}/app.bsky.feed.generator/${feed.rkey}`})

  }
});


export default app
