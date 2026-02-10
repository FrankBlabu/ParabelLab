# Learnings made while developing the project

## Issue 1 — Initial Planning

- The project has no build tooling yet. VSCode tasks (`Checks`, `Test`) referenced in
  the workflow prompts will only become available after Step 01 (Project Setup) is
  implemented. Planning-only issues can skip the validation step.
- The GitKraken MCP integration requires separate authentication via
  `vscode://eamodio.gitlens/link/integrations/connect?id=github&source=mcp`. As a
  fallback, issue content can be fetched via `fetch_webpage` from the GitHub issue URL.
- The `README.md` icon image path was `![](assets/icon.png)`, not `![](a)` as the
  read_file tool initially suggested — always verify exact file content before editing
  (e.g., via `cat -A`).
## Issue 23 — Prepare GitHub Codespaces

- Dev containers use the standard `.devcontainer/devcontainer.json` format defined by the
  [Dev Containers specification](https://containers.dev/).
- The `postCreateCommand` hook is ideal for running setup scripts after the container is
  created (e.g., `npm install`). This ensures dependencies are available in the environment.
- Port forwarding in dev containers requires explicit configuration via the `forwardPorts`
  array to expose development server ports (e.g., Vite on 5173) to the browser.
- Comprehensive documentation for Codespaces should include: setup instructions, development
  workflows, extension information, troubleshooting, and FAQs to reduce support burden.
