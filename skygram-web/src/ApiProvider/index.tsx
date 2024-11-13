import { Agent } from '@atproto/api';
import { ReactNode, useState } from 'react';
import feeds from '../Skygram/feeds';
import ApiContext from './ApiContext';
const ApiProvider = ({ children,agent }: {
    agent: Agent;
    children: ReactNode
}) => {
    const [currentFeed, setCurrentFeed] = useState(feeds[0].did);

    return (
      <ApiContext.Provider value={{
        preferredLanguages: 'en-US,en',
        agent,
        currentFeed,
        setCurrentFeed
      }}>
        {children}
      </ApiContext.Provider>
    );
};
export default ApiProvider;
