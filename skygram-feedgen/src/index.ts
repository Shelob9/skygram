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
}

type Post = {
	uri: string,
	created: string,
	feed_rkey: string,
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



async function upsertFeed({ feed, postsApi, cursors }: {
	feed: Feed,
	postsApi: Posts,
	cursors: Cursors,
}) {
	const { posts, cursor } = await getPosts({
		feed,
		cursors,
	});

	await postsApi.upsertPosts({
		rKey: feed.rKey, posts: posts.map((post) => {
			return {
				uri: post.uri,
				feed_rkey: feed.rKey,
				// @ts-ignore
				created: post.record.createdAt,
			}
		})
	});
	await cursors.setCursor(feed, cursor);
}

function createLuceneQuery(words: string[]) {
	if (1 >= words.length) {
		return words[0];
	}

	return words.map(word => `+${word}`).join(' ');
}
async function getPosts({ feed, cursors }: { feed: Feed, cursors: Cursors }) {
	const { did, search } = feed;
	const q = createLuceneQuery(search);
	const cursor = await cursors.getCursor(feed);

	const { data } = await xrpc.get('app.bsky.feed.searchPosts', {
		params: {
			q,
			limit: 100,
			author: did,
			//cursor,
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


async function syncAll({ KV, DB }: { KV: KVNamespace, DB: D1Database }) {
	const cursors = new Cursors(KV, endpoint, 'injest');
	const postsApi = new Posts(DB);
	for (const feed of joshFeeds) {
		try {
			await upsertFeed({ feed, postsApi, cursors });
		} catch (e) {
			console.error(e);
		}
	}
}

class Posts {
	constructor(private DB: D1Database) { }

	toSkelton(posts: Post[]): AppBskyFeedGetFeedSkeleton.PostView[] {
		return posts.map(post => {
			return {
				post: post.uri,
			}
		});
	}
	async getPosts({ feed_rkey, cursor }: { feed_rkey: string, cursor?: string }) {


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
		return results.results;
	}

	async getPost({ uri }: { uri: string }): Promise<Post | undefined> {
		const result = await this.DB.prepare(`
			SELECT * FROM posts
			WHERE uri = '${uri}'
		`).run();
		if (!result || !result.results.length) {
			return undefined;
		}
		return {
			//@ts-ignore
			uri: result.results[0].uri,
			//@ts-ignore

			created: result.results[0].created,
			//@ts-ignore
			feed_rkey: result.results[0].feed_rkey,
		}
	}

	async deletePost({ uri }: { uri: string }) {
		await this.DB.prepare(`
			DELETE FROM posts
			WHERE uri = '${uri}'`
		).run();
	}

	async upsertPosts({ posts, rKey }: { rKey: string; posts: Post[] },) {
		const queries = posts.map(post => `
			INSERT OR REPLACE INTO posts (uri, created, feed_rkey)
			VALUES ('${post.uri}', '${post.created}', '${rKey}');
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
export default {
	async fetch(request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		const cursor = url.searchParams.get('cursor') || undefined;
		const postsApi = new Posts(env.DB);
		if ('/sync' === url.pathname) {
			await syncAll({
				KV: env.KV,
				DB: env.DB,
			});
			return new Response(
				JSON.stringify({
					sync: joshFeeds,
				}), {
				headers: {
					'Content-Type': 'application/json',
				},
				status: 200
			}
			);
		}
		else if (url.pathname === '/all') {
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
			//2 would be like /:rKey
		} else if (2 == url.pathname.split('/').length) {
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
				}
				);
			}
			const posts = await postsApi.getPosts({ cursor, feed_rkey });

			return new Response(
				JSON.stringify({
					posts,
					feed_rkey,
				}), {
				headers: {
					'Content-Type': 'application/json',
				},
				status: 200
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
				}
				);
			}
			//second part is endpoint,
			if (url.pathname.split('/')[2] !== endpoint) {
				return new Response(
					JSON.stringify({
						message: `${url.pathname.split('/')[2]} not supported`,
						did,
					}), {
					headers: {
						'Content-Type': 'application/json',
					},
					status: 405
				}
				);
			}
			//rkey is thrid part
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

			const posts = await postsApi.getPosts({ cursor, feed_rkey: rKey });
			if (!posts.length) {
				return new Response(
					JSON.stringify({}), {
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
			}
			);
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
		await syncAll({
			KV: env.KV,
			DB: env.DB,
		});
	}


} satisfies ExportedHandler<Env>;
