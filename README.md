# Stationery Hub Backend

## Vercel deployment

Deploy this repository as a Vercel project with the repository root as its project root. `vercel.json` routes requests to the Express application in `index.js`.

Configure these environment variables in Vercel for each environment you deploy:

- `MONGODB_URI` — MongoDB connection string. Ensure the MongoDB user, password, and database are valid, and that the cluster network access rules permit connections from Vercel.
- `BLOB_READ_WRITE_TOKEN` — create or connect a Vercel Blob store to the project and provide its read/write token. Product and blog image uploads use Blob because Vercel function filesystems are not persistent.
- `FRONTEND_ORIGIN` — the frontend's origin with no trailing slash. Defaults to `https://stationery-hub-frontend.vercel.app`.
- `TELEGRAM_TOKEN` and `CHAT_ID` — required for Telegram order notifications.

The same variables can be placed in a local `.env` file; use `.env.example` as a template and do not commit secrets. Uploaded images are limited to 4 MB.

`/health` checks that the app is running without requiring MongoDB. `/ready` checks MongoDB connectivity and returns `503` when the database is unavailable.
