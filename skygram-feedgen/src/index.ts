import '@atcute/bluesky/lexicons';

import { XRPC } from '@atcute/client';
import { AppBskyFeedDefs, AppBskyFeedGetFeedSkeleton, AppBskyFeedSearchPosts } from '@atcute/client/lexicons';
import { josh, joshFeeds } from './josh';
import { Env, Feed, Post } from './types';
import xrpcFactory from './xrpcFactory';

//service: 'https://api.bsky.app' }) });



class Cursors {
	constructor(private KV: KVNamespace, private endpoint: string, private type: string) { }

	private cursorkKey(feed: Feed) {
		return `cursor:${this.type}:${this.endpoint}:${feed.did}:${feed.rKey}`;
	}
	async getCursor(feed: Feed): Promise<string | undefined> {
		const cursor = await this.KV.get(
			this.cursorkKey(feed)
		);
		if (!cursor) {
			return undefined
		}
		return cursor;
	}
	async setCursor(feed: Feed, cursor?: string) {
		if (!cursor) {
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



async function upsertFeed({ feed, postsApi,xrpc }: {
	feed: Feed,
	postsApi: Posts,
	xrpc:XRPC
}) {
	const { posts,  } = await searchPosts({
		xrpc,
		feed,
	});

	await postsApi.upsertPosts({
		rKey: feed.rKey, posts: posts.map((post) => {
			return {
				uri: post.uri,
				feed_rkey: feed.rKey,

				author_did: post.author.did,
				// @ts-ignore
				created: post.record.createdAt,
			}
		})
	});
}

function createLuceneQuery(words: string[]) {
	if (1 >= words.length) {
		return words[0];
	}

	return words.map(word => `+${word}`).join(' ');
}
async function searchPosts({ feed, xrpc,cursor,limit }: {limit?:number,cursor?:string; xrpc:XRPC,feed: Feed }):Promise<AppBskyFeedSearchPosts.Output> {
	const { did, search } = feed;
	const q = createLuceneQuery(search);

	const response  = await xrpc.get('app.bsky.feed.searchPosts', {
		params: {
			q,
			limit: limit || 30,
			author: did,
			cursor,
			sort: 'latest',
		},
	});

	return response.data;
}



async function syncAll({ KV, DB,xrpc}: { xrpc:XRPC, KV: KVNamespace, DB: D1Database, }) {
	const postsApi = new Posts(DB);
	for (const feed of joshFeeds) {
		try {
			await upsertFeed({ feed, postsApi, xrpc });
		} catch (e) {
			console.error(e);
		}
	}
}

class Posts {
	constructor(private DB: D1Database) { }

	toSkelton(posts: Post[]): AppBskyFeedDefs.SkeletonFeedPost[] {
		return posts.map(post => {
			return {
				post: post.uri as string,

			}
		});
	}
	async getPosts({ feed_rkey, cursor }: { feed_rkey: string, cursor?: string }): Promise<Post[] | undefined> {
		const results = cursor ? await this.DB.prepare(`
			SELECT * FROM posts
			WHERE feed_rkey = '${feed_rkey}'
			AND created > '${cursor}'
			ORDER BY created DESC
			LIMIT 100
		`).all() :
			await this.DB.prepare(`
			SELECT * FROM posts
			WHERE feed_rkey = '${feed_rkey}'
			ORDER BY created DESC
			LIMIT 100
		`).all();
		return results.results.length ? results.results.map(this.resultToPost) : undefined;
	}

	private resultToPost(result: any): Post {
		return {
			uri: result.uri as string,
			created: result.created as string,
			feed_rkey: result.feed_rkey as string,
			author_did: result.author_did as string,
		}
	}

	async getPost({ uri }: { uri: string }): Promise<Post | undefined> {
		const result = await this.DB.prepare(`
			SELECT * FROM posts
			WHERE uri = '${uri}'
		`).run();
		if (!result || !result.results.length) {
			return undefined;
		}
		return this.resultToPost(result.results[0]);
	}

	async deletePost({ uri }: { uri: string }) {
		await this.DB.prepare(`
			DELETE FROM posts
			WHERE uri = '${uri}'`
		).run();
	}

	async upsertPosts({ posts, rKey }: { rKey: string; posts: Post[] },) {
		const queries = posts.map(post => `
			INSERT OR REPLACE INTO posts (uri, created, feed_rkey, author_did)
			VALUES ('${post.uri}', '${post.created}', '${rKey}', '${post.author_did}');
		`);

		for (const query of queries) {
			await this.DB.prepare(query).run();
		}
	}
}

class Feeds {

	constructor(private feeds: Feed[]) { }
	isValid(did: string, rKey: string): boolean {
		return - 1 > this.feeds
			.findIndex(feed => feed.did === did && feed.rKey === rKey);
	}
	find(did: string, rKey: string): Feed | undefined {
		return this.feeds.find(feed => feed.did === did && feed.rKey === rKey);
	}
}

const endpoint = 'app.bsky.feed.getFeedSkeleton';
const searchEndpoint = 'app.bsky.feed.searchPosts';

const DID_JSON = {
	"@context": ["https://www.w3.org/ns/did/v1"],
	id: "",
	alsoKnownAs: [],
	authentication: null,
	verificationMethod: [],
	service: [
	  {
		id: "#bsky_fg",
		type: "BskyFeedGenerator",
		serviceEndpoint: "",
	  },
	],
  };


async function wellKnown(request: Request) {
	let host = request.headers.get("Host");
	let didJson = JSON.parse(JSON.stringify( DID_JSON ) );
	didJson.id = `did:web:${host}`;
	didJson.service[0].serviceEndpoint = `https://${host}`;
	let response = new Response(JSON.stringify(didJson));
	response.headers.set("Content-Type", "application/json");
	return response;
}

function errorIfJosh(did: string) : Response | undefined {
	//make error if did is not in joshFeeds
	if (did !== josh) {
		return new Response(
			JSON.stringify({
				message: `Invalid did`,
				did,
				josh
			}), {
			headers: {
				'Content-Type': 'application/json',
			},
			status: 404
		});
	}
}
export default {
	async fetch(request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		console.log({
			url:request.url,
			method: request.method,
			pathname: url.pathname,
		});
		if (request.url.endsWith("/.well-known/did.json")) {
			return await wellKnown(request);
		}

		if( url.pathname.startsWith('/xrpc/app.bsky.feed.describeFeedGenerator')){
			const hostname = 'skygram-feedgen.imaginarymachines.workers.dev';
			const feedGenDid =`did:web:${hostname}`

			return new Response(JSON.stringify({
				did: feedGenDid,
				feeds: joshFeeds.map(feed => {
					return {
						url: `at://${feed.did}/app.bsky.feed.generator/${feed.rKey}`,
					}
				}),

			}), {
				headers: {
					'Content-Type': 'application/json',
				},
				status: 200
			});


		}

		if( url.pathname.startsWith('/xrpc/app.bsky.feed.getFeedSkeleton')){
			//url decord feed in query to get did and rKey
			const feedArg = url.searchParams.get('feed') as string || '';
			console.log({feedArg});
			if (!feedArg) {
				return new Response(
					JSON.stringify({
						message: `Feed not found`,
					}), {
					headers: {
						'Content-Type': 'application/json',
					},
					status: 404
				});
			}

			const did = feedArg.split('at://')[1].split('/app.bsky.feed.generator')[0];
			const rKey = feedArg.split('/').pop();
			console.log({
				did,
				rKey,
			})
			const feed = joshFeeds.find(f => did == f.did && f.rKey === rKey);
			console.log({feed});
			if( ! feed){
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
				});
			}
			const cursor = url.searchParams.get('cursor') || undefined;
			const limit = url.searchParams.get('limit') || '30';
			console.log({feed,did,rKey,cursor,limit});

			try {
				const xrpc = await xrpcFactory({
					identifier: env.BOT_USERNAME,
					password: env.BOT_PASSWORD,
				});
				const results = await searchPosts({feed,xrpc,cursor,limit:parseInt(limit)});
				console.log({r:results.hitsTotal})
				const skeltonPosts = results.posts.map(post => {
					return {
						post: post.uri as string,

					}
				});
				const data: AppBskyFeedGetFeedSkeleton.Output = {
					feed: skeltonPosts,
					cursor: results.cursor,
				};
				return new Response(
					JSON.stringify(data), {
					headers: {
						'Content-Type': 'application/json',
					},
					status: 200
				});
			} catch (error) {
				console.error(error);
				return new Response(
					JSON.stringify({
						message: `Error getting feed`,
						error,
						rKey,
						did,
					}), {
					headers: {
						'Content-Type': 'application/json',
					},
					status: 500
				});
			}
		}

		console.log(`Invalid endpoint`);
		return new Response(JSON.stringify({
			message: `Invalid endpoint`,
		}), {
			headers: {
				'Content-Type': 'application/json',
			},
			status: 405
		});

	},

} satisfies ExportedHandler<Env>;
