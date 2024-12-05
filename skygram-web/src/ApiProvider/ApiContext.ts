import { XRPC } from '@atcute/client';
import { AppBskyActorDefs } from '@atcute/client/lexicons';
import { Agent, } from '@atproto/api';
import { createContext } from 'react';
import feeds from '../Skygram/feeds';

export interface ApiContextType {
  agent: Agent;
  preferredLanguages: string;
  currentFeed: string;
  setCurrentFeed: (feed: string) => void;
  xrpc: XRPC;
  loggedInUser: AppBskyActorDefs.ProfileViewDetailed|undefined

}

 const ApiContext = createContext<ApiContextType>({
  preferredLanguages: 'en-US,en',
  // @ts-ignore
  agent:null,
  currentFeed: feeds[0].did,
  setCurrentFeed: () => {},
  loggedInUser: undefined
});
export default ApiContext;
