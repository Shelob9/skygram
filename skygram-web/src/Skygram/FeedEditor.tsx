import { useEffect, useMemo, useState } from 'react';
import { useApi } from '../ApiProvider/useApi';
import InputField from '../components/Form/InputField';
import Submit from '../components/Form/Submit';
import useSkyGramFeeds, { Feed, useFeedPublish } from './useSkygramFeeds';



export default function FeedEditor(){
    const {xrpc,loggedInUser} = useApi();

    const {did,handle} = useMemo(()=>{
        if(!loggedInUser){
            return {
                did: ''
            }
        }
        return {
            did: loggedInUser.did,
            handle: loggedInUser.handle,
            displayName: loggedInUser.displayName
        }

    },[loggedInUser]);
    const {feeds,addFeed,saveFeeds} = useSkyGramFeeds({xrpc,did:loggedInUser?.did ?? ''});

    const {publishFeed} = useFeedPublish({xrpc});
    const [feed, setFeed] = useState<Feed>({
        repo: did,
        handle: handle ?? '',
        recordName: '',
        displayName: '',
        description: '',
        searchTerm: ''
    });

    function onSave(){
        if(!feed.recordName ){
            setFeed((prev)=>({...prev, recordName:feed.displayName.replace(/\s/g,'-').toLowerCase()}))
        }
        if(xrpc && loggedInUser){
            publishFeed(feed).then(()=>{
                console.log('published feed');
                addFeed(feed);
                saveFeeds();
            }).catch((error)=>{
                console.error(error);
            });
        }
    }

    useEffect(() => {
        if(did && !feed.repo){
            setFeed((prev)=>({...prev, repo: did}))
        }
        if(handle && !feed.handle){
            setFeed((prev)=>({...prev, handle}))
        }

    },[did, feed.handle, feed.repo, handle])
    //when recordKey is changed,


    //Fields for displayName, recordName, description and type
    return <form
        aria-labelledby='feed-creator-title'
        onSubmit={(e)=>{
            e.preventDefault();
            onSave();
        }}
    >
        <h2
            id="feed-creator-title"
            className="text-2xl font-bold"
        >
            Create a new feed
        </h2>
        <InputField
            required
            id="displayName"
            label="Display Name"
            value={feed.displayName}
            onChange={(newValue)=>setFeed((prev)=>({...prev, displayName: newValue}))}
        />
        <InputField
            required
            id="searchTerm"
            label="Search Term"
            value={feed.searchTerm}
            onChange={(newValue)=>setFeed((prev)=>({...prev, searchTerm: newValue}))}
        />
        <InputField
            required
            id="description"
            label="Description"
            value={feed.description}
            onChange={(newValue)=>setFeed((prev)=>({...prev, description: newValue}))}
        />
        <Submit value="Save" />
    </form>
}
