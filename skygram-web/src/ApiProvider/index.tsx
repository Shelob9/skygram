import '@atcute/bluesky/lexicons';
import { XRPC, simpleFetchHandler } from '@atcute/client';
import { Agent } from '@atproto/api';
import { ReactNode, useState } from 'react';
import feeds from '../Skygram/feeds';
import ApiContext from './ApiContext';


const ApiProvider = ({ children,agent }: {
    agent: Agent;
    children: ReactNode
}) => {
    const [currentFeed, setCurrentFeed] = useState(feeds[0].did);
    const xrpc = new XRPC({ handler: simpleFetchHandler({ service: 'https://api.bsky.app' }) });

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
