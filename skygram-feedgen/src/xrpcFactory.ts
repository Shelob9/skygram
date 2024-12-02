import '@atcute/bluesky/lexicons';

import { CredentialManager, XRPC } from '@atcute/client';


export default async function xrpcFactory({
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
