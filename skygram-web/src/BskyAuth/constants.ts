const { searchParams } = new URL(window.location.href)

// Inserted during build
declare const process: { env: { NODE_ENV: string } }

export const ENV = searchParams.get('env') ?? process.env.NODE_ENV

export const PLC_DIRECTORY_URL: string | undefined = undefined;

export const HANDLE_RESOLVER_URL: string = 'https://bsky.social';
