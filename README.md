# Macondo Checker

A slack bot where it prereviews [Macondo](https://macondo.hackclub.com/) before you ship it!

## using

If you are in the [Hack Club Slack](https://slack.hackclub.com/) you can go to [#macondo-checker](https://hackclub.enterprise.slack.com/archives/C0BDBR2MEPM) and send your message there like this example

```text
please review https://macondo.hackclub.com/projects/11216
```

## features
- uses pi the harness to check the github and run commands 
- uses e2b and exa
- follows [RFC i - Guidelines for AI agents in slack](https://hackclub.enterprise.slack.com/docs/T0266FRGM/F0BNTDRNL3T)
- checks ur project again ysws submission guidelines and overall macondo guidelinesw

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
