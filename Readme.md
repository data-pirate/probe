# probe-js 🔍

[![npm version](https://badge.fury.io/js/probe-js.svg)](https://badge.fury.io/js/probe-js)
[![Build Status](https://github.com/data-pirate/probe-js/workflows/CI/badge.svg)](https://github.com/data-pirate/probe-js/actions)
[![codecov](https://codecov.io/gh/data-pirate/probe-js/branch/main/graph/badge.svg)](https://codecov.io/gh/data-pirate/probe-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful and precise tool for traversing and investigating nested objects in JavaScript.

## Features

- 🎯 Find values by key in deeply nested objects
- 📍 Get exact paths to found values
- 🔄 Case-sensitive and case-insensitive search
- 🚀 High performance with optional caching
- 🎮 Simple and intuitive API
- 📊 Built-in performance monitoring
- 💪 Written in TypeScript with full type support

## Installation

```bash
npm install probe-js
# or
yarn add probe-js
```

## Quick Start

```typescript
import { Probe } from 'probe-js';

const data = {
  users: {
    john: {
      id: 1,
      email: 'john@example.com',
      profile: {
        email: 'john.doe@example.com'
      }
    }
  }
};

// Create a new probe
const probe = new Probe(data);

// Find first email
const result = probe.find('email');
console.log(result);
// { value: 'john@example.com', path: 'users.john.email', key: 'email' }

// Find all emails
const allEmails = probe.find('email', 'all');
// [
//   { value: 'john@example.com', path: 'users.john.email', key: 'email' },
//   { value: 'john.doe@example.com', path: 'users.john.profile.email', key: 'email' }
// ]
```

## API

### Creating a Probe

```typescript
const probe = new Probe(data, {
  caseSensitive: true,    // default: true
  maxDepth: Infinity,     // default: Infinity
  pathDelimiter: '.',     // default: '.'
  caching: true          // default: true
});
```

### Methods

#### find(key, occurrence?)
Find value(s) by key
```typescript
probe.find('email');                // Find first occurrence
probe.find('email', 'last');        // Find last occurrence
probe.find('email', 'all');         // Find all occurrences
```

#### findByPath(path)
Find value at exact path
```typescript
probe.findByPath('users.john.email');
```

#### findWhere(predicate)
Find values matching a condition
```typescript
probe.findWhere(value => typeof value === 'number' && value > 10);
```

### Performance Monitoring

```typescript
// Get performance statistics
const stats = probe.getStatistics();
console.log(stats);
// {
//   searches: number,
//   cacheHits: number,
//   cacheMisses: number,
//   averageSearchTime: number
// }

// Clear the cache
probe.clearCache();
```

## Examples

Check out the [examples](./examples) directory for more use cases.

## Documentation

Full documentation is available in the [docs](./docs) directory.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Damanpreet Singh]
