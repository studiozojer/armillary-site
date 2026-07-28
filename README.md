# armillary-site

[armillary.zojer.studio](https://armillary.zojer.studio) — the Astro renderer for [armillary-wiki](https://github.com/studiozojer/armillary-wiki).

**The content is not in this repo.** It lives in `armillary-wiki`, pinned here as a git submodule at `content/wiki`. This repo is one projection of that record.

## Develop

```bash
git clone --recurse-submodules https://github.com/studiozojer/armillary-site.git
cd armillary-site && npm install
npm run dev
```

Forgot `--recurse-submodules`? `git submodule update --init`.

## Test

```bash
npm test
```

Unit tests on the frontmatter schema. A page missing `order`, or claiming `kind: practice`, must fail — that guarantee is why this site is built with Astro rather than a template-based generator.

## Publish

```bash
scripts/deploy-web.sh
```

Updates the content submodule to `origin/main`, builds, checks the output is not silently empty, and rsyncs to the app box. `--pin` builds the currently pinned content commit instead of updating it; `--no-build` ships the existing `dist/`.

The Caddy site block lives at `scripts/armillary-site.Caddyfile` and is appended to `/etc/caddy/Caddyfile` on the box.
