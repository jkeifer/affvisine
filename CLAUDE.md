# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

affvisine is a minimal static site project built with Parcel. It displays a simple welcome page with build information (git commit hash) in the footer.

## Common Commands

### Development
- `npm run dev` - Start Parcel dev server at http://localhost:1234 with hot reload
- `npm run build` - Production build (runs git info script first, outputs to `dist/`)
- `npm run build:dev` - Development build without git info or minification

### Testing
- `npm test` - Run all tests with Jest (uses experimental VM modules)
- `npm run test:coverage` - Run tests with coverage report

### Code Quality
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without modifying

## Project Structure

```
src/
├── index.html      # Entry point with welcome content and footer
├── styles.css      # Minimal application styles
├── build-info.js   # Auto-generated (git commit hash + build timestamp)
└── js/
    ├── main.js     # Updates footer with build info on DOM load
    └── utils/      # Empty directory for future utilities
```

## Architecture

### Build System

**Parcel Bundler**: Zero-config bundler for development and production builds.

**Build Info Generation**: Production builds run `scripts/get-git-info.js` before Parcel:
1. Executes `git describe --match=NeVeRmAtCh --always --abbrev=8 --dirty`
2. Generates `src/build-info.js` with:
   - `BUILD_INFO.commit`: 8-character git hash
   - `BUILD_INFO.buildTime`: ISO timestamp
3. `main.js` imports this and updates `#commit-hash` element in footer

The `--public-url ./` flag in the build script ensures relative paths for GitHub Pages deployment.

### Code Quality Tools

**ESLint** (`eslint.config.js`):
- Based on `@eslint/js` recommended rules
- ES2024 with ES modules
- Key rules:
  - No unused vars (prefix `_` to ignore)
  - Prefer const, no var
  - Complexity warning at 15
  - Console allowed (visualization project)
- Ignores: node_modules, dist, coverage, config files

**Prettier**: Formats JS, JSON, MD, HTML, CSS

**Husky + lint-staged**: Pre-commit hooks auto-format and lint staged files

### Testing Setup

**Jest** (`jest.config.js`):
- Node test environment
- Requires `node --experimental-vm-modules` flag (already in package.json scripts)
- Canvas mock available via `jest-canvas-mock`
- Coverage from `src/js/**/*.js`
- Currently has only placeholder test

### Current State

This is a minimal starter project:
- Basic HTML with welcome message
- Clean CSS with a minimal set of custom properties
- Simple JavaScript that displays build info
- Testing infrastructure configured but minimal tests
- Empty `src/js/utils/` directory ready for future code

## Development Notes

### Running Tests
Always use `npm test` rather than running Jest directly, as the scripts include required `node --experimental-vm-modules` flag.

### Build Process
Production build is two-step:
1. `node scripts/get-git-info.js` → generates `src/build-info.js`
2. `parcel build src/index.html --public-url ./` → bundles to `dist/`

### Deployment
Configured for GitHub Pages at https://jkeifer.github.io/affvisine (see package.json `homepage` field).
