# Contributing to probejs-core

First off, thank you for considering contributing to probejs-core! 

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

## Development Process

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests and linting
6. Commit your changes
7. Push to your fork
8. Submit a Pull Request

## Setting Up Development Environment

1. Clone the repository:
```bash
git clone https://github.com/data-pirate/probejs-core.git
cd probejs-core
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm test
```

## Development Scripts

- `npm run build` - Build the project
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run linter
- `npm run format` - Format code

## Coding Guidelines

### TypeScript Style
- Use TypeScript's strict mode
- Write interfaces for all object shapes
- Use explicit typing
- Document public methods and interfaces

### Testing
- Write unit tests for all new code
- Maintain test coverage above 80%
- Test edge cases thoroughly
- Use descriptive test names

### Git Commit Guidelines

Format: `<type>(<scope>): <subject>`

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests
- chore: Changes to the build process or auxiliary tools

Example:
```
feat(search): add case-insensitive search option
```

## Pull Request Process

1. Update documentation with details of changes
2. Update CHANGELOG.md with a note describing your changes
3. The PR will be merged once you have the sign-off of at least one maintainer

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage
```

## Questions?

Feel free to open an issue with the tag "question".
