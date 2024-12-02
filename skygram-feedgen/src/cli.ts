import { josh, joshFeeds } from "./josh";
import { ManageFeed } from "./manageFeed";
import xrpcFactory from "./xrpcFactory";
//get PASSWORD and USERNAME from process.env
const USERNAME = process.env.USERNAME as string;
const PASSWORD = process.env.PASSWORD as string;

import macyRef from "./cli/macyRef.json";
//async iffy
(async () => {
    if( !USERNAME || !PASSWORD){
        console.error('USERNAME and PASSWORD are required (set in process.env')
        return;
    }
    const xrpc = await xrpcFactory({
        identifier: USERNAME,
        password: PASSWORD
    });

    const manager = new ManageFeed(xrpc, {
        publisherDid: josh,
        hostname: 'skygram-feedgen.imaginarymachines.workers.dev'
    });
    const feedGenDid =`did:web:${manager.hostname}`


    await Promise.all(joshFeeds.map(async feed => {
        console.log(`Publishing feed ${feed.name}`);
        try {
            const {data} =  await xrpc.request({
                nsid: 'com.atproto.repo.putRecord',
                type: 'post',
                data: {
                    repo: josh,
                    collection: 'app.bsky.feed.generator',
                    rkey: feed.rKey,
                    record: {
                        did: feedGenDid,
                        displayName: feed.name,
                        description: feed.description,
                        createdAt: new Date().toISOString(),
                        avatarRef: macyRef,
                    },
                },
                headers: {
                    'content-type': 'application/json',
                },
            })
            console.log({data});
        } catch (error) {
            console.error(error);

        }
    }))




})();
