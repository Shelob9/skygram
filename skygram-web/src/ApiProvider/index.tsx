import '@atcute/bluesky/lexicons';
import { simpleFetchHandler, XRPC, } from '@atcute/client';
import { AppBskyActorDefs } from '@atcute/client/lexicons';
import { Agent, } from '@atproto/api';
import { ReactNode, useEffect, useState } from 'react';
import feeds from '../Skygram/feeds';
import ApiContext from './ApiContext';
import { handleOauth, isOauthReturn, restoreSession } from './BskyAuth';


const ApiProvider = ({ children,agent }: {
    agent: Agent;
    children: ReactNode
}) => {
    const [currentFeed, setCurrentFeed] = useState(feeds[0].did);
    const [xrpc, setXrpc] = useState<XRPC | null>(() => new XRPC({ handler: simpleFetchHandler({ service: 'https://api.bsky.app' }) }));
    const [did, setDid] = useState<string | undefined>(undefined);
    const [loggedInUser, setLoggedInUser] = useState<AppBskyActorDefs.ProfileViewDetailed|undefined>(undefined);
    useEffect(() => {
      if(isOauthReturn()){
        handleOauth().then((result) => {
          if(result && result.xrpc){
            setXrpc(result.xrpc)
          }
          //reload page
          window.location.href = window.location.origin
        }).catch((e) => {
          console.error({handleOauthError:e})
        });
      }else{
        restoreSession().then((result) => {

          if(result && result.xrpc){
            setXrpc(result.xrpc)
          }

          if(result && result.did){
            setDid(result.did)
          }
        }).catch((e) => {
          console.error({restoreSessionError:e})
        });
      }
    },[])

    useEffect(() => {
      if(did && xrpc){
        xrpc.get('app.bsky.actor.getProfile', {
          params: {
            actor: did,
          }
        }).then((result) => {
          setLoggedInUser(result)
        });
      }
    },[did,xrpc])
    return (
      <ApiContext.Provider value={{
        preferredLanguages: 'en-US,en',
        agent,
        currentFeed,
        setCurrentFeed,
        xrpc,
        loggedInUser
      }}>
        {children}
      </ApiContext.Provider>
    );
};
export default ApiProvider;
