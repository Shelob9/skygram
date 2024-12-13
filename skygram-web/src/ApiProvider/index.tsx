import '@atcute/bluesky/lexicons';
import { CredentialManager, simpleFetchHandler, XRPC, } from '@atcute/client';
import { AppBskyActorDefs } from '@atcute/client/lexicons';
import { ReactNode, useEffect, useState } from 'react';
import feeds from '../Skygram/feeds';
import ApiContext from './ApiContext';
import { destorySession, handleOauth, isOauthReturn, restoreSession } from './BskyAuth';

// in dev mode, try to use password
async  function tryPasswordLogin():Promise<XRPC>{
  const manager = new CredentialManager({ service: 'https://bsky.social' });
  const xrpc = new XRPC({ handler: manager });

  await manager.login({ identifier: import.meta.env.VITE_DEV_BOT_USERNAME, password: import.meta.env.VITE_DEV_BOT_PASSWORD });

  return xrpc;
}
const ApiProvider = ({ children }: {
    children: ReactNode
}) => {
    const [currentFeed, setCurrentFeed] = useState(feeds[0].did);
    const [xrpc, setXrpc] = useState<XRPC | null>(() => {
      return new XRPC({ handler: simpleFetchHandler({ service: 'https://api.bsky.app' }) })
  });
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
          destorySession()
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
          setLoggedInUser(result.data)
        });
      }
    },[did,xrpc])
    // in dev mode, try to use password
    useEffect( () => {
      if(  import.meta.env.MODE === 'development' ){
        tryPasswordLogin().then((result) => {
          setXrpc(result)
          setDid(`did:plc:jr2c44ndobinz7s7by4j73hb`)
        });
      }
    },[])

    return (
      <ApiContext.Provider value={{
        preferredLanguages: 'en-US,en',
        currentFeed,
        setCurrentFeed,
        xrpc: xrpc as XRPC,
        loggedInUser
      }}>
        {children}
      </ApiContext.Provider>
    );
};
export default ApiProvider;
