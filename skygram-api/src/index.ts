import { Agent } from '@atproto/api';
import { Hono } from 'hono';

const app = new Hono()
const url = `https://skygram.imaginarymachines.xyz`

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



app.get('/api/posts', async(c) => {
  const gardening = {
    did: `did:plc:5rw2on4i56btlcajojaxwcat`,
    rkey: `aaao6g552b33o`,
  }
  const agent = new Agent({
    service: 'https://api.bsky.app'
   })
   try {
    const { data } = await agent.app.bsky.feed.getFeed(
      {
        feed: `at://${gardening.did}/app.bsky.feed.generator/${gardening.rkey}`,
        limit: 30,
      },

    );
    const { feed: posts, cursor: nextCursor } = data;

    return c.json({nextCursor,posts, })
   } catch (error) {
      console.error({error})
      return c.json({error})

   }
});


export default app
