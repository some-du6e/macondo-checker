# macondo-checker



## running




install deps:

```bash
bun install
```

fill out the .env:

```env
SLACK_BOT_TOKEN=
SLACK_APP_TOKEN=
SLACK_CHANNEL_ID=

PI_MODEL_API= # set this to either custom or openrouter
PI_MODEL_BASE_URL= # base url ending in v1 
PI_MODEL= # set this to ur model
PI_MODEL_KEY= # ur api key 

E2B_API_KEY= # e2b key 
EXA_API_KEY= # exa key
```

running:

```bash
bun run index.ts
```

running in dev mode:

```bash
bun run start
```
