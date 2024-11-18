# UI For Skygram.app

[https://skygram.app](https://skygram.app) front-endd source.

## Development
Run from root dir is better

- `bun i`
- `bun run dev`

## Deploy

- `bun run build`
- `bunx wrangler deploy  --assets ./dist --name skygram-web --compatibility-date 2024-11-04`
- `bunx wrangler deploy  --assets ./dist --name skygram-web-router --compatibility-date 2024-11-04`
