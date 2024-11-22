import '@atcute/bluesky/lexicons';

import { CredentialManager, XRPC } from '@atcute/client';
import { AppBskyFeedDefs, AppBskyFeedGetFeedSkeleton } from '@atcute/client/lexicons';
type Env = {
	DB: D1Database,
	KV: KVNamespace,
	BOT_USERNAME: string,
	BOT_PASSWORD: string,
}

	//service: 'https://api.bsky.app' }) });

const josh = 'did:plc:payluere6eb3f6j5nbmo2cwy';

type Feed = {
	did: string,
	rKey: string,
	name: string,
	search: string[],
}

type Post = {
	uri: string,
	created: string,
	feed_rkey: string,
	author_did: string,
}
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
	const { posts,  } = await getPosts({
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
async function getPosts({ feed, xrpc,cursor }: {cursor?:string; xrpc:XRPC,feed: Feed }) {
	const { did, search } = feed;
	const q = createLuceneQuery(search);

	const { data } = await xrpc.get('app.bsky.feed.searchPosts', {
		params: {
			q,
			limit: 100,
			author: did,
			cursor,
		},
	});

	return data;
}

const joshFeeds: Feed[] = [
	{
		did: josh,
		rKey: 'gm',
		search: ['Good Morning'],
		name: 'Josh Good Morning Feed',
	},
	{
		did: josh,
		rKey: 'flowers',
		search: ['flowers'],
		name: 'Josh Flowers',
	},
	{
		did: josh,
		rKey: "flower",
		search: ["flower"],
		name: "Flowers",
	},
	{
		did: josh,
		rKey: "dog",
		search: ["dog"],
		name: "Dog posting",
	},
];


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

async function xrpcFactory({
	identifier,
	password
 }: {
	identifier: string,
	password: string,
 }): Promise<XRPC> {
	const manager = new CredentialManager({ service: 'https://bsky.social' });
	await manager.login({ identifier,password	 });
	const xrpc = new XRPC({ handler:manager  });
	return xrpc;
}
export default {
	async fetch(request, env: Env, ctx: ExecutionContext) {

		const url = new URL(request.url.replace("/feedgen/xrpc", ""));
		const cursor = url.searchParams.get('cursor') || undefined;
		const postsApi = new Posts(env.DB);
		const xrpc = await xrpcFactory({
			identifier: env.BOT_USERNAME,
			password: env.BOT_PASSWORD,
		});

		if (2 == url.pathname.split('/').length) {
			const feed_rkey = url.pathname.split('/')[1];
			const feeds = new Feeds(joshFeeds);
			const feed = feeds.find(josh, feed_rkey);
			if (!feed) {
				return new Response(
					JSON.stringify({
						message: `Feed with rkey ${feed_rkey} not found`,
						feed_rkey,
					}), {
					headers: {
						'Content-Type': 'application/json',
					},
					status: 404
				});
			}
			const posts = await postsApi.getPosts({ cursor, feed_rkey });

			return new Response(
				JSON.stringify({
					posts,
					feed_rkey,
				}),
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

		} else if (4 == url.pathname.split('/').length) {
			//first part is did
			const did = url.pathname.split('/')[1];

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
			//second part is endpoint,
			const rEndpoint = url.pathname.split('/')[2];
			if (![endpoint, searchEndpoint].includes(rEndpoint)) {
				return new Response(
					JSON.stringify({
						message: `Invalid endpoint`,
						rEndpoint,
						endpoint,
						searchEndpoint
					}), {
					headers: {
						'Content-Type': 'application/json',
					},
					status: 405
				});
			}
			//rkey is third part
			const rKey = url.pathname.split('/')[3];
			const feed = joshFeeds.find(f => did == f.did && f.rKey === rKey);
			//has feed with did and rkey
			if (!feed) {
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
			if( rEndpoint === searchEndpoint){
				try {
					const results = await getPosts({feed,xrpc,cursor});
					return new Response(
						JSON.stringify(results), {
						headers: {
							'Content-Type': 'application/json',
						},
						status: 200
					});
				} catch (error) {
					return new Response(
						JSON.stringify({
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
			const posts = await postsApi.getPosts({ cursor, feed_rkey: rKey });
			if (!posts || !posts.length) {
				return new Response(
					JSON.stringify({}),
					{
						headers: {
							'Content-Type': 'application/json',
						},
						status: 404
					}
				);
			}
			const skeltonPosts = postsApi.toSkelton(posts);
			const data: AppBskyFeedGetFeedSkeleton.Output = {
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
			});
		}
		return new Response(
			JSON.stringify({}), {
			headers: {

				'Content-Type': 'application/json',
			},
			status: 404
		}
		);

	},
	async scheduled(_event, env: Env, _ctx: ExecutionContext) {
		const xrpc = await xrpcFactory({
			identifier: env.BOT_USERNAME,
			password: env.BOT_PASSWORD,
		});
		await syncAll({
			KV: env.KV,
			DB: env.DB,
			xrpc,
		});
	}


} satisfies ExportedHandler<Env>;
