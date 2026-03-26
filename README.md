# †忍狐†

[ninko.cc](https://ninko.cc/) で公開中の個人サイトです

## Installation

```
$ git clone https://github.com/ninko-txz/ninko
$ cd ninko
$ npm install
```

> [!CAUTION]
> Make sure to protect `/logs/` with Cloudflare Access (Zero Trust) before deploying.
> Anyone can view your access logs without this setting.

```
$ npx wrangler d1 create ninko-logs
$ npx wrangler d1 execute ninko-logs --remote --command "CREATE TABLE access_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accessed_at TEXT,
    path TEXT,
    ip TEXT,
    region TEXT,
    city TEXT,
    org TEXT,
    ua TEXT,
    referer TEXT
);"
```

> Run the following command to exclude your own accesses from the logs (optional)

```
$ npx wrangler secret put CF_AUD
```

## Usage

```
$ npm run [command]
```

| Command     | Description                                                      |
| ----------- | ---------------------------------------------------------------- |
| build       | Build the project                                                |
| deploy      | Deploy to Cloudflare                                             |
| clean       | Remove build artifacts                                           |
| clean:all   | Remove build artifacts and image files                           |
| serve       | Start the development server                                     |
| serve:cache | Start the development server with caching enabled                |
| dev         | Start the local Cloudflare Workers emulator with /logs/ endpoint |
