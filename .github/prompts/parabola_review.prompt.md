---
name: plab_review
description: Fetch and implement the reviewer suggestions from a pull request
agent: agent
---

# Objective

> Your goal is to fetch and implement the suggestions a reviewer has left on a pull request

# Workflow

Given a pull request, perform the necessary steps in the following order:

## Implementation

- Ask for the pull request URL or ID. If the user provides a URL, extract the pull request ID from the URL.
- Check if the current branch is the branch the pull request relates to. If not, switch to the correct branch.
- Check if the pull request is already closed. In this case, check if the reviewer suggestions were already implemented or are outdated. For the suggestions which are not implemented yet and not outdated, assume that they were added to the PR after the PR was closed and merged. Open a new branch, implement the suggestions and create a new PR in this case.
- Read through the peer review related comments of the given pull request and understand the suggested changes.
- Implement the suggested changes in the codebase following the project guidelines and best practices.
- Analyze why the suggested changes were found in a pull request only and not during the initial implementation. Add appropriate learnings and tests if this can prevent similar issues in the future.

## Check and tests

- Run all checks. Fix all warnings and errors before proceeding to the next step.
- Run all tests. Fix all warnings and errors before proceeding to the next step.

## Commit and push

- If the suggestion implementation led to additional important learnings, add these learnings to the `LEARNINGS.md` file in the root of the repository.
- Commit the changes to the current branch. 
- Push the committed changes to the remote repository.
