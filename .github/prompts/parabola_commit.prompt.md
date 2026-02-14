---
name: plab_commit
description: Commit the current changes
agent: agent
---

# Objective

> Your goal is to commit and push the current changes.

# Workflow

Perform the necessary steps in the following order:

## Add learnings

- Append important learnings discovered during the implementation to the `LEARNINGS.md` file in the project root.

## Create a branch if there is non yet

- Check if the current git branch is `main`.
  - If so, create a new branch with a descriptive name reflecting the changes made. Use kebab-case for the branch name. Let the branch begin with the implemented issue number, e.g. `123-add-user-authentication`.  
  - Switch to the newly created branch.
- If there is already a branch different from `main` matching the issue number, continue using this branch.
- If there is already a branch different from `main` but not matching the issue number, warn the user and ask if they want to continue using this branch or create a new one. If they choose to create a new one, follow the steps above to create and switch to the new branch.

## Commit changes

- Commit the current set of changes into the branch.
- Use a descriptive commit message reflecting the changes made. Let the commit message begin with the implemented issue number, e.g. `123: Add user authentication`.
- If there are multiple logical changes, create multiple commits with descriptive commit messages into the same branch.
- After all changes are committed, review the commit history to ensure that all changes are properly documented.
- Review the changes and ensure that all changes are included in the commits.
- If there is an original issue, add a comment to the issue linking the commits and describing the changes made. If there are multiple commits, link all commits in the comment.

## Push changes

- Push the committed changes to the remote repository.
- Ensure that the push is successful and that the changes are reflected in the remote repository.

## Create pull request

- Create a pull request for merging the changed into the `main` branch.
- If the implemented issue is known, link that pull request to the implemented issue. Add 'Fixes #issue_number' to the pull request description if there is an implemented issue, but direct MCP access to the PR is not possible.
- Add a summary about that pull request to its description.
