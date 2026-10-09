# Retry policy port (TypeScript)

Private downstream for [oc-port-demo-rust](https://github.com/kyeshmz/oc-port-demo-rust). The schema-backed `oc-port-agent.json` points at that live GitHub repository and selects its retry behavior. The tool is installed from the portable `tools/oc-port-agent.tgz` artifact.

## GitHub Action

Run **Live upstream sync** from the Actions tab. It is manual-only while validating the integration, and supports two provider modes:

- `opencode` (default): `OPENCODE_API_KEY`, model `opencode/gpt-6.1-sol` by default. No Anthropic credential is required.
- `external`: `PROVIDER_API_KEY` secret, `PROVIDER_API_KEY_ENV` repository variable (e.g. `OPENAI_API_KEY`), and `PROVIDER_MODEL` variable or the workflow's model input.

Both need `OC_PORT_GITHUB_TOKEN`, scoped to read the private Rust reference and push branches/create PRs in this repo. Never put secrets into the model input, tracking policy, or source files.

`check` previews pending upstream commits without a model call or publication. `sync` adapts new changes and opens a draft PR only after trusted verification. `adopt` reevaluates existing selected functionality. Nothing auto-merges or deploys.

Verification installs dependencies, clones/pins the Rust reference to the packet commit, runs Rust tests, and runs TypeScript build/unit/differential tests. Target-only validation and `retryLabel` must survive.

## Local use

```sh
npm ci
npm run port -- check
npm run port -- sync
```

Private upstream reads require authenticated Git. Normal sync performs the configured reference preparation before parity. For standalone `npm test`, set `OC_PORT_REFERENCE_DIRECTORY` to a trusted checkout of the Rust repo.
