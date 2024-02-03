# Retherswap Labs Interface

An open source interface for Retherswap -- a protocol for decentralized exchange of Hypra Network tokens.

- Website: [retherswap.org](https://retherswap.org/)
- Interface: [app.retherswap.org](https://app.retherswap.org)
- Docs: [retherswap.org/docs/](https://docs.retherswap.org/)
- Twitter: [@Retherswap](https://twitter.com/Retherswap)
- Email: [support@retherswap.org](mailto:support@retherswap.org)
- Telegram: [Retherswap](https://t.me/Retherswap)
- Whitepapers:
  - [V1](https://github.com/Retherswap/Whitepaper)

## Accessing the Retherswap Interface

To access the Retherswap Interface, use an IPFS gateway link from the
[latest release](https://github.com/Retherswap/interface/),
or visit [app.retherswap.org](https://app.retherswap.org).

## Unsupported tokens

Check out `useUnsupportedTokenList()` in [src/state/lists/hooks.ts](./src/state/lists/hooks.ts) for blocking tokens in your instance of the interface.

You can block an entire list of tokens by passing in a tokenlist like [here](./src/constants/lists.ts)

## Contributions

For steps on local deployment, development, and code contribution, please see [CONTRIBUTING](./CONTRIBUTING.md).
