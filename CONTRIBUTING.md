# Contributing to affvisine

Thank you for your interest in contributing to affvisine! This guide will help
you get started with development, testing, and contributing to the project.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm
- Git

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/jkeifer/affvisine.git
   cd affvisine
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at http://localhost:1234

4. **Verify your setup**

   ```bash
   npm test
   npm run lint
   ```

## 🏗️ Development Workflow

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (includes git info) |
| `npm run build:dev` | Build for development (unminified, no git info) |
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code style and quality |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

### Pre-commit Hooks

The project uses Husky and lint-staged to run quality checks before commits:

- **ESLint**: Code quality and style checks
- **Prettier**: Code formatting

If pre-commit hooks fail, fix the issues before committing:

```bash
npm run lint:fix
npm run format
```

## 🏛️ Project Structure

```plaintext
src/
├── index.html           # Main HTML entry point
├── styles.css           # Application styles
├── build-info.js        # Auto-generated build information
└── js/
    ├── main.js          # Application entry point
    ├── affine-visualizer.js  # Transformation visualizer logic
    └── utils/           # Utility modules
```

The project uses **Parcel** as its bundler for zero-config development and builds.

### Build Information

The production build automatically generates `src/build-info.js` containing:
- Git commit hash (short, 8 characters)
- Build timestamp

This information is displayed in the page footer.

## 🎯 Contributing Guidelines

### Code Style

The project uses ESLint and Prettier:

#### ESLint Rules

- **No unused variables** (prefix with `_` if intentionally unused)
- **Prefer const** for immutable variables
- **Complexity limits** (max 15 for functions)
- **ES2024 syntax** with ES modules

#### Code Conventions

- **ES6 modules** (`import`/`export`)
- **Modern JavaScript** features encouraged

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Follow existing code patterns
   - Add tests for new functionality

3. **Test your changes**

   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Pre-commit hooks will run automatically.

5. **Push and create a pull request**

   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Process

1. **Ensure tests pass**: All tests and linting must pass
2. **Update tests**: Add tests for new features or bug fixes
3. **Update docs**: Update relevant documentation if needed
4. **Review**: Request review from maintainers

## 🚀 Deployment

The site is configured for GitHub Pages deployment at https://jkeifer.github.io/affvisine

### Build Process

```bash
npm run build              # Production build (with git info)
npm run build:dev          # Development build
```

Output goes to `dist/` directory.

## 🐛 Debugging & Troubleshooting

### Common Issues

#### Linting Errors

```bash
npm run lint:fix          # Auto-fix most issues
npm run format            # Format code
```

#### Build Issues

```bash
rm -rf .parcel-cache dist  # Clear caches
npm run build:dev          # Build without minification
```

## 🤝 Community

- **Issues**: Report bugs or request features on GitHub
- **Discussions**: Use GitHub Discussions for questions
