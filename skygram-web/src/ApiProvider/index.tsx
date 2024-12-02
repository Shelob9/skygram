import '@atcute/bluesky/lexicons';
import { simpleFetchHandler, XRPC } from '@atcute/client';
import { getSession, OAuthUserAgent } from '@atcute/oauth-browser-client';
import { Agent } from '@atproto/api';
import { ReactNode, useEffect, useState } from 'react';
import feeds from '../Skygram/feeds';
import ApiContext from './ApiContext';

async function resumeSession(did:string) {
  const session = await getSession(`did:${did}`, { allowStale: true });
  return session;
}




const ApiProvider = ({ children,agent }: {
    agent: Agent;
    children: ReactNode
}) => {
    const [currentFeed, setCurrentFeed] = useState(feeds[0].did);
    const xrpc = new XRPC({ handler: simpleFetchHandler({ service: 'https://api.bsky.app' }) });

    useEffect(() => {
      resumeSession(`did:plc:jr2c44ndobinz7s7by4j73hb`).then(session => {
        console.log(session);
        const agent = new OAuthUserAgent(session);
        const rpc = new XRPC({ handler: agent });
        rpc.get('com.atproto.identity.resolveHandle', {
          params: {
            handle: 'josh412.com',
          },
        }).then(({ data }) => {
          console.log(data);
        });
      });

    },[])
    return (
      <ApiContext.Provider value={{
        preferredLanguages: 'en-US,en',
        agent,
        currentFeed,
        setCurrentFeed,
        xrpc
      }}>
        {children}
      </ApiContext.Provider>
    );
};
export default ApiProvider;
