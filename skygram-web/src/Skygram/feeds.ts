export type Feed ={
    rkey: string,
    did: string
    label: string
    emoji: string
    didDisplay: string
}
const feeds : Feed[] = [
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
        did: `blueskyfeeds.com`,
        rkey: `toe-beans`,
        label: `Toe Beans`,
        //cat emoji
        emoji: `🐈`
    },
    //birds daryllmarie.bsky.social/feed/aaagllxbcbsje
    {
        did: ` daryllmarie.bsky.social`,
        rkey: `aaagllxbcbsje`,
        label: `Birds`,
        //bird emoji
        emoji: `🐦`//
    },
    //art
    //https://bsky.app/profile/bsky.art/feed/art-new

    {
        did: `bsky.art`,
        rkey: `art-new`,
        label: `Art`,
        //paint palette emoji
        emoji: `🎨`
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
        did: `daryllmarie.bsky.social`,
        rkey: `aaacjerk7gwek`,
        label: `Marine Life`,
        //fish emoji
        emoji: `🐟`
    }
].map(feed => {
    if(!feed.didDisplay){
        feed.didDisplay = feed.did
    }
    if(!feed.did.startsWith('did:plc')){
        feed.did = `did:plc:${feed.did}`
    }

    return feed;
});
export default feeds;
