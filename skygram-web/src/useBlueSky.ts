import { BrowserOAuthClient, OAuthClientMetadataInput, OAuthSession } from "@atproto/oauth-client-browser";
import { useEffect, useRef } from "react";

const clientId = `https://skgram-api.imaginarymachines.workers.dev/api/oauth.json`

const meta : OAuthClientMetadataInput = {
    client_name: "Skygram",
    client_uri: "https://skygram.imaginarymachines.xyz",
    logo_uri: "https://cdn.josh412.com/uploads/2024/06/macy-bear.jpg",
    tos_uri: "https://skygram.imaginarymachines.xyz/tos",
    policy_uri: "https://skygram.imaginarymachines.xyz/policy",
    redirect_uris: ["https://skygram.imaginarymachines.xyz"],
    scope: "atproto",
    grant_types:["authorization_code", "refresh_token"],
    token_endpoint_auth_method:"none",
    application_type:"web",
    "dpop_bound_access_tokens":true,
}
async function init(): Promise<{ session?: OAuthSession; state?: string, client?: BrowserOAuthClient }> {
    try {
        const client = await BrowserOAuthClient.load({
            //clientId: clientId,
            clientMetadata: meta,

        });
        const result: undefined | { session: OAuthSession; state?: string } =
        await client.init()

        if (result) {
            const { session, state } = result
            if (state != null) {
                console.log(
                    `${session.sub} was successfully authenticated (state: ${state})`,
                )
            } else {
                console.log(`${session.sub} was restored (last active session)`)
            }
        }
        console.log({ result })
        return {
            session: result?.session,
            state: result?.state,
            client
        }
    } catch (error) {
        console.log({ error })
        throw error
    }
}
export function useBluesky() {
        const client = useRef<BrowserOAuthClient>()


    useEffect(() => {
    init().then((result) => {
        if (result.client) {
            client.current = result.client
        } else {
            alert("No client")
        }
    });
}, [])



return client.current
}
