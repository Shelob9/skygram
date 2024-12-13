export type T_Feed ={
    rkey: string,
    did: string
    label: string
    emoji: string
    didDisplay: string,
    displayName?: string,
    uri: string
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
        emoji: '🌱',
        uri: `at://did:plc:5rw2on4i56btlcajojaxwcat/app.bsky.feed.generator/aaao6g552b33`    },
    //toe beans
    {
        did: `eubjsqnf5edgvcc6zuoyixhw`,
        rkey: `toe-beans`,
        label: `Toe Beans`,
        //cat emoji
        emoji: `🐈`,
        uri: `at://did:plc:eubjsqnf5edgvcc6zuoyixhw/app.bsky.feed.generator/toe-beans`
    },
    //birds daryllmarie.bsky.social/feed/aaagllxbcbsje
    {
        did: `daryllmarie.bsky.social`,
        rkey: `aaagllxbcbsje`,
        label: `Birds`,
        //bird emoji
        emoji: `🐦`,//,
        uri: `at://did:plc:ffkgesg3jsv2j7aagkzrtcvt/app.bsky.feed.generator/aaagllxbcbsje`
    },
    //mamals
    //https://bsky.app/profile/daryllmarie.bsky.social/feed/aaan2gurxv3kk
    {
        did: `daryllmarie.bsky.social`,
        rkey: `aaan2gurxv3kk`,
        label: `Mamals`,
        //mamal emoji
        emoji: `🦁`,
        uri: `at://did:plc:ffkgesg3jsv2j7aagkzrtcvt/app.bsky.feed.generator/aaan2gurxv3kk`
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
        emoji: `🐟`,
        uri: `at://did:plc:ffkgesg3jsv2j7aagkzrtcvt/app.bsky.feed.generator/aaacjerk7gwek`,
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
        emoji: `🐕`,
        uri: `at://did:plc:lcn5zsz2e7kjwoe4ldf3chr5/app.bsky.feed.generator/aaangplovi6dw`
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
