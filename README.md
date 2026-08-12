# Pi Clear Screen

A small [Pi coding agent](https://github.com/earendil-works/pi-mono) extension that clears the visible terminal viewport:

- when Pi launches;
- after the user starts a session with `/new`;
- when the user enters `/clear`.

It clears only the visible viewport, not terminal scrollback. It does not clear automatically on `/reload`, `/resume`, or `/fork`. Non-interactive Pi modes are unaffected.

## Usage

Enter `/clear` at any time in interactive mode to clear and redraw Pi's visible terminal viewport.

## Install

Install from npm:

```bash
pi install npm:@janvitos/pi-clear-screen
```

Or install from GitHub:

```bash
pi install git:github.com/janvitos/pi-clear-screen
```

Restart Pi after installation, or run `/reload` in an existing session.

## Try without installing

```bash
pi -e npm:@janvitos/pi-clear-screen
```

## Requirements

- Pi 0.84.1 or newer
- Node.js 22.6 or newer for development tests
- Interactive TUI mode

## Development

```bash
npm test
npm run check
npm pack --dry-run
```

For local development, clone the repository and load `index.ts` with `pi -e`, or symlink the repository into `~/.pi/agent/extensions/`.

## Publishing

Releases are published through npm Trusted Publishing. Bump the version, push a matching tag, and publish a GitHub release; `.github/workflows/publish.yml` tests and publishes the package using GitHub Actions OIDC, without a long-lived npm token.

## License

MIT
