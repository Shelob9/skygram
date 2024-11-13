import { Agent } from '@atproto/api';
import { createContext } from 'react';
import feeds from '../Skygram/feeds';

export interface ApiContextType {
  agent: Agent;
  preferredLanguages: string;
  currentFeed: string;
  setCurrentFeed: (feed: string) => void;

}

 const ApiContext = createContext<ApiContextType>({
  preferredLanguages: 'en-US,en',
  // @ts-ignore
  agent:null,
  currentFeed: feeds[0].did,
  setCurrentFeed: () => {}
});
export default ApiContext;
