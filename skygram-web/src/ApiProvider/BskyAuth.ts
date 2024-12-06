import { XRPC } from '@atcute/client';
import { OAuthUserAgent, configureOAuth, createAuthorizationUrl, deleteStoredSession, finalizeAuthorization, getSession, listStoredSessions, resolveFromIdentity } from '@atcute/oauth-browser-client';

const APP_URL =`https://skygram.com:5000`;//"https://skygram.app"


configureOAuth({
	metadata: {
		client_id: `${APP_URL}/api/oauth.json`,
		redirect_uri: `${APP_URL}`,
	},
});
export const HANDLE_STORE_KEY = "__skygram_handle"
export async function startLogin(username:string) {
    const { identity, metadata } = await resolveFromIdentity(username);
    localStorage.setItem(HANDLE_STORE_KEY,username);
    const authUrl = await createAuthorizationUrl({
        metadata: metadata,
        identity: identity,
        scope: 'atproto transition:generic',
    });
    console.log('starting auth')
    window.location.assign(authUrl);
    await sleep(200);
}

async function finalize() {
    const params = new URLSearchParams(location.hash.slice(1));
    history.replaceState(null, '', location.pathname + location.search);
    const session = await finalizeAuthorization(params);
    const agent = new OAuthUserAgent(session);
    return agent
}


export const isOauthReturn = () => {
    return location.href.includes('state')
}

export async function handleOauth() {
    if (!isOauthReturn()) {
        return undefined;
    }
    const agent = await finalize();
    const xrpc = new XRPC({handler: agent});
    return {
        agent,
        xrpc,

    }
}



export async function restoreSession() {

    const stored = await listStoredSessions();
    if(stored.length === 0){
        return undefined;
    }
    const did = stored[0] as `did:${string}`;
    const session = await getSession(did, { allowStale: true });
    const agent = new OAuthUserAgent(session)
    const xrpc = new XRPC({handler: agent});
    return {
        agent,
        xrpc,
        did
    }
}

export async function destorySession() {
    const stored = await listStoredSessions();
    if(stored.length === 0){
        return undefined;
    }
    const did = stored[0] as `did:${string}`;
    await deleteStoredSession(did)
    //reload page
    window.location.href = window.location.origin
}

async function sleep(ms:number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
