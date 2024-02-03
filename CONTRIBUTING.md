# Contributing

Thank you for your interest in contributing to the Retherswap interface! 

# Development

Before running anything, you'll need to install the dependencies:

```
npm install
```

## Running the interface locally

```
npm run start
```

The interface should automatically open. If it does not, navigate to [http://localhost:3000].

## Creating a production build

```
npm run build
```

To serve the production build:

```
serve -s build
```

Then, navigate to [http://localhost:3000] to see it.

## Engineering standards

Code merged into the `main` branch of this repository should adhere to high standards of correctness and maintainability.
Use your best judgment when applying these standards. If code is in the critical path, will be frequently visited, or
makes large architectural changes, consider following all the standards.

- Have at least one engineer approve of large code refactorings
- At least manually test small code changes, prefer automated tests
- Thoroughly unit test when code is not obviously correct
- If something breaks, add automated tests so it doesn't break again
- Add integration tests for new pages or flows
- Verify that all CI checks pass before merging
- Have at least one product manager or designer approve of any significant UX changes

## Guidelines

The following points should help guide your development:

- Security: the interface is safe to use
  - Avoid adding unnecessary dependencies due to [supply chain risk](https://github.com/LavaMoat/lavamoat#further-reading-on-software-supplychain-security)
- Reproducibility: anyone can build the interface
  - Avoid adding steps to the development/build processes
  - The build must be deterministic, i.e. a particular commit hash always produces the same build
- Decentralization: anyone can run the interface
  - An Ethereum node should be the only critical dependency
  - All other external dependencies should only enhance the UX ([graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation))
- Accessibility: anyone can use the interface
  - The interface should be responsive, small and also run well on low performance devices (majority of swaps on mobile!)

## Release process

Releases are cut automatically from the `main` branch Monday-Thursday in the morning according to the [release workflow](./.github/workflows/release.yaml).

Fix pull requests should be merged whenever ready and tested.
If a fix is urgently needed in production, releases can be manually triggered on [GitHub](https://github.com/Retherswap/interface/actions/workflows/release.yaml)
after the fix is merged into `main`.

Features should not be merged into `main` until they are ready for users.
When building larger features or collaborating with other developers, create a new branch from `main` to track its development.
Use the automatic Vercel preview for sharing the feature to collect feedback.  
When the feature is ready for review, create a new pull request from the feature branch into `main` and request reviews from
the appropriate UX reviewers (PMs or designers).

## Finding a first issue

Start with issues with the label
[`good first issue`](https://github.com/Retherswap/interface/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).

Thanks for contributing to Retherswap!