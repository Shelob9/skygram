export type T_Feed ={
    rkey: string,
    did: string
    label: string
    emoji: string
    didDisplay: string,
    displayName?: string
}
const feeds : T_Feed[] = [
    //Gardening
    //https://bsky.app/profile/eepy.bsky.social/feed/aaao6g552b33o
    {
        rkey: 'aaao6g552b33o',
        did: '5rw2on4i56btlcajojaxwcat',
        didDisplay: `eepy.bsky.social`,
       // did: 'eepy.bsky.social',
        label: 'Gardening Feed',
        emoji: '🌱'
    },
    //toe beans
    {
        did: `eubjsqnf5edgvcc6zuoyixhw`,
        rkey: `toe-beans`,
        label: `Toe Beans`,
        //cat emoji
        emoji: `🐈`
    },
    //birds daryllmarie.bsky.social/feed/aaagllxbcbsje
    {
        did: `daryllmarie.bsky.social`,
        rkey: `aaagllxbcbsje`,
        label: `Birds`,
        //bird emoji
        emoji: `🐦`//
    },
    //mamals
    //https://bsky.app/profile/daryllmarie.bsky.social/feed/aaan2gurxv3kk
    {
        did: `daryllmarie.bsky.social`,
        rkey: `aaan2gurxv3kk`,
        label: `Mamals`,
        //mamal emoji
        emoji: `🦁`
    },
    //marine life
    //https://bsky.app/profile/daryllmarie.bsky.social/feed/aaacjerk7gwek
    {
        didDisplay: `daryllmarie.bsky.social`,
        did: `ffkgesg3jsv2j7aagkzrtcvt`,
        displayName: `Daryll Marie`,
        rkey: `aaacjerk7gwek`,
        label: `Marine Life`,
        //fish emoji
        emoji: `🐟`
    },
    //dogs
    //https://bsky.app/profile/crevier.bsky.social/feed/aaangplovi6dw
    //lcn5zsz2e7kjwoe4ldf3chr5
    {
        did: `lcn5zsz2e7kjwoe4ldf3chr5`,
        didDisplay: `crevier.bsky.social`,
        rkey: `aaangplovi6dw`,
        label: `Dogs`,
        //dog emoji
        emoji: `🐕`
    }
].map(feed => {
    if(!feed.didDisplay && feed.did === `daryllmarie.bsky.social`){
        feed = {
            ...feed,
            did: `ffkgesg3jsv2j7aagkzrtcvt`,
            didDisplay: `daryllmarie.bsky.social`,
            displayName: `Daryll Marie`,
        }
    }
    if(!feed.didDisplay && feed.did === `eubjsqnf5edgvcc6zuoyixhw`){
        feed = {
            ...feed,
            didDisplay: `blueskyfeeds.com`,
            displayName: `Bluesky Feeds`,
        }
    }
    if(!feed.didDisplay){
        feed.didDisplay = feed.did
    }
    if(!feed.did.startsWith('did:plc')){
        feed.did = `did:plc:${feed.did}`
    }

    return feed;
});
export default feeds;
