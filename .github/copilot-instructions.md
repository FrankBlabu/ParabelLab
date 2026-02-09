<!--
#
# copilot-instructions.md - Basic project description and instructions for coding agents
#
-->

# Rules

## General

- The implementation must follow the best practices for good, sustainable, maintainable and understandable code.
- There are no quick fixes. The generated or adapted code must be high quality, industry standard code.
- The generated code must be documented well, so it can be comprehended and maintained by humans, too.
- Prefer VSCode tasks over shell commands when possible.
- For file manipulation (rename, move, delete, ...) prefer VSCode APIs over shell commands.

## Implementation

- All code must be fully typed.

## Repository

- The repository name for this project is `https://github.com/FrankBlabu/ParabelLab.git`.
- Before committing anything, ensure that all checks and tests pass successfully.

# Documentation

- The `doc` folder in the main project directory contains the general project manifest, guidelines and architecture descriptions.

# Tools

- Prefer tools over prompts whenever possible.
- Prefer VSCode tasks over shell commands when possible.
- The following tools are available in the project and can be used as needed.

|VSCode Task|Description|
|-----------|-----------|

# Tests

- Ensure that tests are isolated and do not depend on external state. 
- Use mocking and stubbing where necessary to simulate dependencies. 
- Write tests that are easy to understand and maintain, with clear assertions and descriptive names. 
  - Each test file has a descriptive header explaining its purpose and scope. 
  - Each test case has a header comment describing what it tests and the expected outcome in some detail. 
  - The test code is commented to explain complex logic or non-obvious decisions.

