export type Env = {
	DB: D1Database,
	KV: KVNamespace,
	BOT_USERNAME: string,
	BOT_PASSWORD: string,
}
export type Feed = {
	did: string,
	rKey: string,
	name: string,
	search: string[],
    description: string,
}

export type Post = {
	uri: string,
	created: string,
	feed_rkey: string,
	author_did: string,
}
