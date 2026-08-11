# White website

[![Website](https://github.com/pangbai520/White-Language-Site/actions/workflows/deploy.yml/badge.svg)](https://github.com/pangbai520/White-Language-Site/actions/workflows/deploy.yml)

This repository contains [white-lang.org](https://www.white-lang.org). The site is built with Docusaurus 3.

The language itself lives elsewhere:

- [whitelanguage/white](https://github.com/whitelanguage/white) contains `wlc`, the standard library, and the language tests.
- [whitelanguage/wlls](https://github.com/whitelanguage/wlls) contains the language server.
- [whitelanguage/vscode-white](https://github.com/whitelanguage/vscode-white) contains the VS Code extension.

## Local development

Node.js 20 or later is required.

```bash
npm ci
npm run start
```

Before pushing a change, run the same checks used by CI:

```bash
npm run typecheck
npm run build
```

Site pages are in `src/pages`, global styles are in `src/css/custom.css`, and translations are under `i18n`. The English documentation source remains in `docs`.

Pull requests are built but not deployed. A push to `main` publishes the completed `build` directory to Cloudflare Pages.

## License

Apache-2.0. See [LICENSE](LICENSE).