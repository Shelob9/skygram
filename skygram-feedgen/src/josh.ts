import { Feed } from './types';

export const josh = 'did:plc:payluere6eb3f6j5nbmo2cwy';
export const joshBot = 'did:plc:jr2c44ndobinz7s7by4j73hb';
export const joshFeeds: Feed[] = [
	{
		did: josh,
		rKey: 'gm',
		search: ['Good Morning'],
		name: 'Josh\'s GM Posts',
		description: 'My Good Morning Posts',
	},
	{
		did: josh,
		rKey: "macy",
		search: ["Macy"],
		name: "Macy posting",
		description: "Posts with my dog Macy in them",
	},
];
