# Contributing

Thanks for your interest in contributing to `accent-folding`!

## Getting started

**Prerequisites:** Node.js ≥ 18 and pnpm. If you don't have pnpm, enable it via [Corepack](https://nodejs.org/api/corepack.html): `corepack enable`.

```sh
git clone https://github.com/ZRktty/accent-folding.git
cd accent-folding
pnpm install
```

## Running tests

```sh
pnpm test
```

## Making changes

1. Fork the repo and create a branch from `main`.
2. Make your changes — keep them focused and minimal.
3. Ensure tests pass: `pnpm test`.
4. Open a pull request with a clear description of what changed and why.

## Reporting bugs

Open an issue on [GitHub](https://github.com/ZRktty/accent-folding/issues) with a minimal reproduction case.

## Suggesting features

Open an issue describing the use case before implementing anything large. For small, obvious improvements a PR is welcome directly.

## Code style

- No build step — plain JavaScript.
- Avoid adding dependencies. The library ships with zero runtime dependencies.
- Keep it small. Run `pnpm size` to check bundle size; changes that significantly increase it need strong justification.

## License

By contributing you agree that your contributions will be licensed under the [MIT License](LICENSE).
