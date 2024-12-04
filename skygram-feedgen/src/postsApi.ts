import { Env } from "./types";
import verifyWebhookSignature from "./verifyWebhookSignature";

function jsonResponse(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
export default async function postsApi(request:Request, env: Env){
	const method = request.method;
    const url = new URL(request.url);
	switch (method) {
        case 'GET':
            const allPosts = await env.DB.prepare(`SELECT * FROM posts`).all();
            return jsonResponse({ok:allPosts.success,posts:allPosts.results});
        case 'POST':
            //eventType is last part of url
            const eventType = url.pathname.split('/').pop();
            //const signature = c.req.header('x-signature');
            const signature = request.headers.get('x-signature');
            const timestamp = request.headers.get('x-timestamp');
            const body = await request.text();
            const valid = verifyWebhookSignature({
                secret:'jr2c44ndobinz7s7by4j73hb',
                body,
                signature:signature??'',
                timestamp:timestamp??''
            })
            if(!valid){
                return jsonResponse({ok:false,error:'invalid signature'},401);
            }
            const data = JSON.parse(body);
            const createdAt = data.commit.record.createdAt;
            const rKey = data.commit.rkey;
            const collection = data.commit.collection;
            console.log({collection,createdAt,rKey});
            switch (eventType) {
                case 'post-created':
                    const {results} = await env.DB
                        .prepare(`INSERT OR REPLACE INTO posts (created, rkey, did)
                        VALUES ('${createdAt}', '${rKey}', '${data.did}');`)
                        .run()
                        console.log({results})
                    break;
                case 'post-deleted':
                    const {results:results2} = await env.DB
                        .prepare(`DELETE FROM posts WHERE rkey='${rKey}'`)
                        .run()
                    console.log({results2})
                    break;

                default:
                    break;
            }
            return jsonResponse({ok:true,data:{rKey,collection,createdAt}});
	}

    return  jsonResponse({ok:false,error:'method not allowed'},405);
}
