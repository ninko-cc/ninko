# †忍狐†

[ninko.cc](https://ninko.cc/) で公開中の個人サイトです

## Installation

```
$ git clone https://github.com/ninko-txz/ninko
$ cd ninko
$ npm install
```

> [!WARNING]
> Make sure to protect `/logs/` with Cloudflare Access (Zero Trust) before deploying.
> Anyone can view your access logs without this setting.

```
$ npx wrangler d1 create ninko-logs
$ npx wrangler d1 execute ninko-logs --remote --file ./sql/create-table.sql
```

> [!NOTE]
> Run the following command to exclude your own accesses from the logs (optional)

```
$ openssl rand -hex 32 | npx wrangler secret put NINKO_AUTH_TOKEN
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
