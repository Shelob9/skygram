import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import InputField from '../components/Form/InputField';
import SelectBox from '../components/Form/SelectBox';
import Submit from '../components/Form/Submit';

export const Route = createLazyFileRoute('/feedgen')({
  component: RouteComponent,
})
type Feed = {
    repo: string;
    handle: string;
    recordName: string;
    displayName: string;
    description: string;
}
function RouteComponent() {
  return <FeedEditor />
}

function FeedEditor(){
    const [feed, setFeed] = useState<Feed&{
        type: 'search'|'bangers'
    }>({
        repo: '',
        handle: '',
        recordName: '',
        displayName: '',
        description: '',
        type:'search'
    });


    function onSave(){
        console.log(feed);
    }

    //when recordKey is changed,


    //Fields for displayName, recordName, description and type
    return <form
        aria-labelledby='feed-creator-title'
        onSubmit={(e)=>{
            e.preventDefault();
            onSave();
        }}
        className="flex flex-col gap-4"
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
            id="recordName"
            label="Record Name"
            value={feed.recordName}
            onChange={(newValue)=>setFeed((prev)=>({...prev, recordName: newValue}))}
        />
        <SelectBox
            label='Type'
            id='type'
            options={[
                {value: 'search', label: 'Search'},
                {value: 'bangers', label: 'My Best Posts'}
            ]}
            selected={feed.type}
            setSelected={(newValue)=>setFeed((prev)=>({...prev, type: newValue as 'search'|'bangers'}))}
        />
        <Submit value="Save" />
    </form>
}
