import { XRPC } from "@atcute/client";
import '@atcute/client/lexicons';
import { At } from "@atcute/client/lexicons";

type Feed_Generator ={
    // DID of the account that will publish the feed.
    //FEEDGEN_PUBLISHER_DID
    publisherDid: string;
    // The hostname of the feed generator service.
    hostname: string;
}

type Feed = {
    repo: string;
    handle: string;
    recordName: string;
    displayName: string;
    description: string;
}
export class ManageFeed {

    constructor(
        private xrpc: XRPC,
        private feedGen: Feed_Generator){

    }
    get hostname(){
        return this.feedGen.hostname;
    }
    async publishFeed(
        { repo, recordName, displayName, description,avatarRef }: Feed & {avatarRef?: At.Blob}
    ){
        const feedGenDid =`did:web:${this.feedGen.hostname}`

        const response = await this.xrpc.request({
            nsid: 'com.atproto.repo.putRecord',
            type: 'post',
            data: {
                repo,
                collection: 'app.bsky.feed.generator',
                rkey: recordName,
                record: {
                    repo,
                    did: feedGenDid,
                    displayName: displayName,
                    description: description,
                    avatar: avatarRef,
                    createdAt: new Date().toISOString(),
                },
            },
            headers: {
                'content-type': 'application/json',
            },
        })
        return response;
    }

    async unpublishFeed({repo, recordName}:Pick<Feed,'recordName'|'repo'>){
        await this.xrpc.request({
            nsid: 'com.atproto.repo.deleteRecord',
            type: 'post',
            params: {
                repo,
                collection: 'app.bsky.feed.generator',
                rkey: recordName,
            }
        })
    }
}
