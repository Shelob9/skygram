import { BskyAgent } from "@atproto/api";


//get PASSWORD and USERNAME from process.env
const USERNAME = process.env.USERNAME as string;
const PASSWORD = process.env.PASSWORD as string;


//async iffy
(async () => {
    if( !USERNAME || !PASSWORD){
        console.error('USERNAME and PASSWORD are required (set in process.env')
        return;
    }




    const macy = Bun.file(`${import.meta.dir}/macy.jpg`);
    const agent = new BskyAgent({
        service: "https://bsky.social",

    })
    try {
        await agent.login({
            identifier: USERNAME,
            password: PASSWORD,
        });
        const image = await macy.text()

        const encoding = 'image/jpeg'
        const upload = await agent.uploadBlob(image, { encoding }).catch(
            (error) => {
                console.log({ upload: error })
            }
        )
        await Bun.write(`${import.meta.dir}/macyRef.json`, JSON.stringify(upload.data.blob));

        console.log({ upload })
    } catch (error) {
        console.log({ error })

    }

})()
