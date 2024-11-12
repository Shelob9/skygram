import { Agent } from '@atproto/api';
import { ReactNode } from 'react';
import ApiContext from './ApiContext';
 const ApiProvider = ({ children,agent }: {
    agent: Agent;
    children: ReactNode }) => {

  return (
    <ApiContext.Provider value={{
      preferredLanguages: 'en-US,en',
      agent,
    }}>
      {children}
    </ApiContext.Provider>
  );
};
export default ApiProvider;
