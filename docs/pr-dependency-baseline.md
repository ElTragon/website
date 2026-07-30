# PR 1 dependency baseline

Recorded on July 30, 2026 before the PR 1 runtime and dependency update.

## Runtime

- Active Node.js version: `16.15.0`
- Active npm version: `9.6.4`
- Target Node.js version: `22.23.1`
- Target npm version: `10.9.8`
- Package manager files present: `package-lock.json` and `yarn.lock`

## Build failure

`npm run build` exits before compilation:

```text
Gatsby requires Node.js 18.0.0 or higher (you have v16.15.0).
```

## Direct dependency inventory

The pre-update manifest used:

- Gatsby `^5.10.0`; installed version `5.14.1`
- React and React DOM `^18.1.0`; installed version `18.2.0`
- Gatsby plugins spanning the `3.10`, `5.1`, `5.10`, `5.11`, `6.10`,
  `6.11`, and `7.10` release lines
- Three overlapping Playwright packages: `playwright`,
  `playwright-chromium`, and `@playwright/test`

Major upgrades intentionally deferred from this PR include React 19, Mermaid 11, Tailwind CSS 4, Prettier 3, dotenv 17, and react-icons 5.

## Accepted security debt

The final production dependency audit has no critical findings. The remaining
findings include 50 high-severity advisories transitive through the Gatsby 5
ecosystem. They cannot be removed by the available automated fixes without
incompatible Gatsby downgrades or other breaking changes, so they remain
accepted ecosystem debt pending the post-PR framework decision.

## Build and test constraints

- Gatsby builds no longer launch Playwright or download a browser. Mermaid
  diagrams are rendered in the visitor's browser, so production builds work
  when Playwright downloads are disabled or the browser CDN is unavailable.
  The complete E2E suite checks every Mermaid-bearing post, and the original
  diagram source remains visible until rendering succeeds and serves as the
  no-JavaScript fallback.
- End-to-end tests still require Chromium. The test lifecycle has one canonical
  browser installation step, while CI provisions Linux system dependencies
  separately.
- CI rejects critical production vulnerabilities while allowing the documented
  Gatsby ecosystem debt below that threshold.
- `npm ci --omit=dev` is supported for installing production dependencies, but
  `npm run build` is not supported after omitting development dependencies
  because Gatsby build tooling remains in `devDependencies`.
- The Playwright suite targets this site's production output at
  `http://127.0.0.1:9000`; it does not use an external test site.
