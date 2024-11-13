import { Agent } from '@atproto/api';
import { createContext } from 'react';

export interface ApiContextType {
  agent: Agent;
  preferredLanguages: string;

}

 const ApiContext = createContext<ApiContextType>({
  // @ts-ignore
  preferredLanguages: 'en-US,en',
  agent:null
});
export default ApiContext;
