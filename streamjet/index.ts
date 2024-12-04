import sendEvent from "./sendEvent";

const josh = 'did:plc:payluere6eb3f6j5nbmo2cwy';
const joshBot = 'did:plc:jr2c44ndobinz7s7by4j73hb'
const args = {
  wantedCollections: ["app.bsky.feed.post", "app.bsky.feed.like"],
  wantedDids: [josh, joshBot],
};

let query = `?`;
args.wantedCollections.forEach((collection) => {
    query += `wantedCollections=${collection}&`;
});
args.wantedDids.forEach((did) => {
    query += `wantedDids=${did}&`;
});

const url = "wss://jetstream2.us-east.bsky.network/subscribe" + query;
console.log({url})
const socket = new WebSocket(url);

const log = async (eventType:string, data:any) => {
    const url = `http://localhost:8787/api/posts/${eventType}`
    const response = await sendEvent(url,'jr2c44ndobinz7s7by4j73hb',data)
    console.log({eventType,response})
}
socket.addEventListener("message", async(event) => {
    const data = JSON.parse(event.data);
    const {kind,did} = data;
    if('commit' === kind) {
        const {collection,record,operation} = data.commit;

        switch(collection) {

            case 'app.bsky.feed.post':
                if('create' === operation) {
                    await log('post-created', {
                        did,
                        record,
                        commit: data.commit
                    })
                }else if('delete' === operation) {
                    await log('post-deleted', {
                        did,
                        record,
                        commit: data.commit
                    })
                }
                break;
            case 'app.bsky.feed.like':
                if('create' === operation) {
                    await log('like-created', {
                        did,
                        commit: data.commit
                    })
                }else if('delete' === operation) {
                    await log('like-removed', {
                        did,
                        commit: data.commit
                    })
                }

                break
            }

    }
});

// socket opened
socket.addEventListener("open", event => {
    console.log('Opened')
});

// socket closed
socket.addEventListener("close", event => {
    console.log("CLOSED")
});

// error handler
socket.addEventListener("error", event => {
    console.log({error:event})
});
