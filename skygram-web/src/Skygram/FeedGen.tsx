import { createPortal } from "react-dom";
import { undefined } from "zod";
import { useApi } from "../ApiProvider/useApi";
import Aside from "./Aside";
import FeedEditor from "./FeedEditor";
import UserProfile from "./Feeds/Profile";
import Header from "./Header";
import useSkyGramFeeds from "./useSkygramFeeds";

const Side = () => {
    const {loggedInUser,xrpc} = useApi();
    console.log({loggedInUser,xrpc});
    const {feeds} = useSkyGramFeeds({xrpc,did:loggedInUser?.did ?? ''});
    console.log({feeds});
    return (
        <Aside title="Your Feeds">
            <div>
               {loggedInUser? <UserProfile profile={loggedInUser} /> :undefined}
            </div>
        </Aside>
    )
}



export default function FeedGen() {
    return (
        <>
        {createPortal(<Header />, document.getElementById('skygram-header'))}
        {createPortal(<Side />, document.getElementById('skygram-main-aside'))}
            <div
                className="h-full pt-8"
            >
                <div className="border flex flex-col gap-4 p-4 rounded w-full">
                    <FeedEditor />
                </div>
            </div>
        </>
    );

}
