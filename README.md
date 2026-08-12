# Pi Clear Screen

A small [Pi coding agent](https://github.com/earendil-works/pi-mono) extension that clears the visible terminal viewport:

- when Pi launches;
- after the user starts a session with `/new`.

It does not erase terminal scrollback, and it does not clear on `/reload`, `/resume`, or `/fork`. Non-interactive Pi modes are unaffected.

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

## License

MIT
