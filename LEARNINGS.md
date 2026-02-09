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