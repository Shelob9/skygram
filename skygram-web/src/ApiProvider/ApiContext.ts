import { XRPC } from '@atcute/client';
import { AppBskyActorDefs } from '@atcute/client/lexicons';
import { createContext } from 'react';
import feeds from '../Skygram/feeds';

export interface ApiContextType {
  preferredLanguages: string;
  currentFeed: string;
  setCurrentFeed: (feed: string) => void;
  xrpc: XRPC;
  loggedInUser: AppBskyActorDefs.ProfileViewDetailed|undefined

}

 const ApiContext = createContext<ApiContextType>({
  preferredLanguages: 'en-US,en',
  // @ts-ignore
  currentFeed: feeds[0].did,
  setCurrentFeed: () => {},
  loggedInUser: undefined,
  //ts-ignore
  xrpc: undefined,
});
export default ApiContext;
