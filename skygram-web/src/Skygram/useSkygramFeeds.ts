import { XRPC } from "@atcute/client";
import { useEffect, useState } from "react";
const BSKY_FEEDS_COLLECTION = 'app.bsky.feed.generator'
export type Feed = {
    repo: string;
    handle: string;
    recordName: string;//rKey
    displayName: string;
    description: string;
    searchTerm: string;
}

async function publishFeed({xrpc,feed,feedGenDid}:{
    xrpc: XRPC,
    feed: Feed;
    feedGenDid: string
}){
    const{repo,recordName,displayName,description} = feed;
    try {
        const data = await saveRecord({
            xrpc,
            repo,
            rkey: recordName,
            collection: BSKY_FEEDS_COLLECTION,
            record: {
                did: feedGenDid,
                displayName,
                description,
                createdAt: new Date().toISOString(),
            }
        })

        console.log({data});
        return data;
    } catch (error) {
        console.error(error);

    }
}

async function saveRecord({xrpc,repo,rkey,collection,record}:{
    xrpc: XRPC,
    repo: string,
    collection: string,
    rkey: string,
    record: Record<string,any>,
}){
    try {
        const {data} =  await xrpc.request({
            nsid: 'com.atproto.repo.putRecord',
            type: 'post',
            data: {
                repo,
                collection,
                rkey,
                record
            },
            headers: {
                'content-type': 'application/json',
            },
        })
        console.log({data});
        return data;
    } catch (error) {
        console.error(error);

    }
}

async function getRecord({xrpc,repo,rkey,collection}:{
    xrpc: XRPC,
    repo: string,
    collection: string,
    rkey: string,
}){
    try {
        const {data} =  await xrpc.request({
            nsid: 'com.atproto.repo.getRecord',
            type: 'post',
            data: {
                repo,
                collection,
                rkey,
            },
            headers: {
                'content-type': 'application/json',
            },
        })
        console.log({data});
        return data;
    } catch (error) {
        console.error(error);

    }
}

async function getCollection({xrpc,repo,collection}:{
    xrpc: XRPC,
    repo: string,
    collection: string,
}){
    try {
        const {data} =  await xrpc.request({
            nsid: 'com.atproto.repo.listRecords',
            type: 'get',
            params: {
                repo,
                collection,
            },
            headers: {
                'content-type': 'application/json',
            },
        })
        console.log({data});
        return data;
    } catch (error) {
        console.error(error);

    }
}


const COLLECTION = 'app.skygram.feeds';
const RKEY = 'settings'
const hostName = 'skygram-feedgen.imaginarymachines.workers.dev';
export function useFeedPublish({xrpc}:{
    xrpc: XRPC,
}){
    return {
        publishFeed:(feed:Feed)=> publishFeed({
            xrpc,
            feed,
            feedGenDid: `did:web:${hostName}`
        })
    }
}
type UseFeeds_Props = {
    xrpc: XRPC,
    did: string
}
export function useBlueskyFeeds({xrpc,did}:UseFeeds_Props){
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        setIsLoading(true);
        getCollection({
            xrpc,
            repo: did,
            collection: BSKY_FEEDS_COLLECTION
        }).then((data)=>{
            console.log({data});
            if(data){
                //Saved bluesky feeds.
                //a) make them work with feedgen (save in db or query from bsky api)
                //b) save list of feeds to display on site with did, order and emoji
                //c) On poster page, show list of feeds with emoji and name
                //d) On poster page, display those feeds
                setFeeds(data.records.map((record:Record<string,any>)=>{
                    return {
                        ...record.value,
                        uri: record.uri,
                        cid: record.cid,
                    };
                }));
            }
        }).catch((error)=>{
            console.error(error);
        }).finally(()=>{
            setIsLoading(false);
        })
    },[did,xrpc])

    return {
        blueskyFeeds: feeds,
        isLoadingBlueskyFeeds: isLoading
    }

}

export default function useSkyGramFeeds({xrpc,did}:UseFeeds_Props){

    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    function getFeeds(){
        setIsLoading(true);
        getRecord({
            xrpc,
            repo: did,
            collection: COLLECTION,
            rkey: RKEY
        }).then((data)=>{
            console.log({data});
            if(data){
                setFeeds(data.feeds);
            }
        }).catch((error)=>{
            console.error(error);
        }).finally(()=>{
            setIsLoading(false);
        })
    }

    function addFeed(feed:Feed){
        setFeeds((prev)=>[...prev,feed]);
    }

    function removeFeed(rKey:string){
        setFeeds((prev)=>prev.filter((feed)=>feed.recordName !== rKey));
    }

    function saveFeeds(){
        setIsLoading(true);
        saveRecord({
            xrpc,
            repo: did,
            collection: COLLECTION,
            rkey: RKEY,
            record: {
                feeds
            }
        }).then((data)=>{
            console.log({data});
        }).catch((error)=>{
            console.error(error);
        }).finally(()=>{
            setIsLoading(false);
        });
    }

    return {
        feeds,
        getFeeds,
        addFeed,
        removeFeed,
        saveFeeds,
        isLoadingFeeds: isLoading
    }



}
