import '@atcute/bluesky/lexicons';

import { XRPC, simpleFetchHandler } from '@atcute/client';
import { AppBskyFeedGetFeedSkeleton } from '@atcute/client/lexicons';
type Env = {
	DB: D1Database,
	KV: KVNamespace,
}
const xrpc = new XRPC({ handler: simpleFetchHandler({ service: 'https://api.bsky.app' }) });
const josh = 'did:plc:payluere6eb3f6j5nbmo2cwy';

type Feed = {
	did: string,
	rKey: string,
	name: string,
	search: string[],
	compare: 'AND'|'OR',
}

type Post = {
	uri : string,
	created: string,
	did: string,
}
class Cursors {
	constructor(private KV: KVNamespace,private endpoint:string) {}

	private cursorkKey(feed: Feed) {
		return `cursor_${this.endpoint}:${feed.did}:${feed.rKey}`;
	}
	async getCursor(feed: Feed) : Promise<string | undefined> {
		const cursor =  await this.KV.get(
			this.cursorkKey(feed)
		);
		if(!cursor) {
			return undefined
		}
		return cursor;
	}
	async setCursor(feed: Feed, cursor?: string) {
		if(!cursor) {
			return await this.KV.delete(
				this.cursorkKey(feed)
			);
		}
		return await this.KV.put(
			this.cursorkKey(feed),
			cursor
		);
	}
}

async function upsertPosts({DB,posts}: { DB: D1Database,posts: Post[] }, ) {
	const queries = posts.map(post => `
		INSERT OR REPLACE INTO posts (uri, created, did)
		VALUES ('${post.uri}', '${post.created}', '${post.did}');
	`);

	for (const query of queries) {
	  await DB.prepare(query).run();
	}
}
async function upsertFeed({feed,DB,cursors}:{
	feed: Feed,
	DB: D1Database,
	cursors: Cursors,
}) {
	const {posts,cursor} = await getPosts({
		feed,
		cursors,
	});

	await upsertPosts({DB,posts:posts.map((post) => {
		return {
			uri: post.uri,
			did: feed.did,
			// @ts-ignore
			created: post.record.createdAt,
		}
	})});
	await cursors.setCursor(feed,cursor);
}

function createLuceneQuery(words: string[], compare : 'AND'|'OR') {
	if(1 >= words.length) {
	  return words[0];
	}
	if(compare === 'OR') {
		return words.join(' ');
	}

	return words.map(word => `+${word}`).join(' ');
}
async function getPosts({feed,cursors}: { feed: Feed,cursors: Cursors }) {
	const {did,search,compare} = feed;
  	const q = createLuceneQuery(search,compare);
	const cursor =  await cursors.getCursor(feed);
    const {data} = await xrpc.get('app.bsky.feed.searchPosts', {
      params: {
        q,
        limit: 100,
        author:did,
        cursor,
      },
    });

	return data;
}

const joshFeeds : Feed[] = [
	{
		did: josh,
		rKey: 'gm',
		search: ['Good Morning'],
		name: 'Josh Good Morning Feed',
		compare: 'AND',
	},
	{
		did: josh,
		rKey: 'flowers',
		search: ['flower','flowers','🌺','🌸','🌻','🌼','☀️','🌹'],
		name: 'Josh Flower Posting',
		compare: 'OR',
	}
];



const endpoint = 'app.bsky.feed.searchPosts';
export default {
	async fetch(request, env:Env, ctx:ExecutionContext) {


		const url = new URL(request.url);
				//if first url  is '/all

			//return all saved posts
			if(url.pathname === '/all') {
				const results = await env.DB.prepare(`
					SELECT * FROM posts
					ORDER BY created DESC
					LIMIT 100
				`).all();


				return new Response(
					JSON.stringify({
						posts: results.results
					}), {
						headers: {
							'Content-Type': 'application/json',
						},
						status: 200
					}
				);
			}
		//first part is did
		const did = url.pathname.split('/')[1];
		//make error if did is not in joshFeeds
		if(!joshFeeds.find(feed => feed.did === did)) {
			return new Response(
				JSON.stringify({
					message: `Feed with rkey ${did} not found`,
					did,
				}), {
					headers: {
						'Content-Type': 'application/json',
					},
					status: 404
				}
			);
		}
		//second part is endpoint, make error if it is not 'app.bsky.feed.searchPosts'
		if(url.pathname.split('/')[2] !== endpoint) {
			return new Response(
				JSON.stringify({
					message: 'Endpoint not supported',
					did,
				}), {
					headers: {
						'Content-Type': 'application/json',
					},
					status: 404
				}
			);
		}
		//rkey is thrid part
		const rKey = url.pathname.split('/')[3];
		const feed = joshFeeds.find(f => did == f.did && f.rKey === rKey);
		//has feed with did and rkey
		if(!  feed ) {
			return new Response(
				JSON.stringify({
					message: `Feed with did ${did} not found`,
					rKey,
					did,
				}), {
					headers: {
						'Content-Type': 'application/json',
					},
					status: 404
				}
			);
		}
		//cursor from query arg
		const cursor = url.searchParams.get('cursor');
		//get posts since cursor
		const results = cursor ? await env.DB.prepare(`
			SELECT * FROM posts
			WHERE did = '${did}'
			WHERE created > '${cursor}'
			ORDER BY created DESC
			LIMIT 100
		`).all() :
		await env.DB.prepare(`
			SELECT * FROM posts
			WHERE did = '${did}'
			ORDER BY created DESC
			LIMIT 100
		`).all();
		console.log({results});
		const skeltonPosts = results.results.map(post => {
			return {
				post: post.uri,
			}
		});
		const data : AppBskyFeedGetFeedSkeleton.Output = {
			feed: skeltonPosts,
			cursor: skeltonPosts.length ? skeltonPosts[skeltonPosts.length - 1].created : undefined,
		};
		return new Response(
			JSON.stringify(data), {
				headers: {
					'X-Skygram-Feed': feed.name,
					'X-Skygram-Feed-RKey': feed.rKey,
					'X-Skygram-Feed-Did': feed.did,
					'Content-Type': 'application/json',
				},
				status: 200
			}
		);
	},
	async scheduled(_event, env: Env, _ctx: ExecutionContext) {
		const cursors = new Cursors(env.KV, endpoint);
		for (const feed of joshFeeds) {
		  await upsertFeed({ feed, DB: env.DB, cursors });
		}
	}


} satisfies ExportedHandler<Env>;
