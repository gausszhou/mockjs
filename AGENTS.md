# AGENTS.md - Mock.js Development Guide

## Overview

Mock.js generates random data and intercepts Ajax requests. Source in `src/`, tests in `test/`, built output in `dist/`.

## Build, Lint, and Test Commands

```bash
# Run tests (Mocha + PhantomJS)
npm test
gulp mocha

# Lint only
gulp jshint

# Build (lint + webpack + tests)
gulp build

# Build webpack only
gulp webpack

# Dev server on port 5050 with watch
gulp
```

**Running a single test**: Edit `test/test.mock.html` to load only specific test files, or modify the test file directly to run specific cases.

## Code Style Guidelines

### General
- Plain JavaScript (ES5), 4-space indentation
- No semicolons (ASI enabled in `.jshintrc`)
- CommonJS modules (`module.exports`)

### File Headers
```javascript
/* global require, module, window */
```

### Naming
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: lowercase with dots
- Modules: Capitalized (`Mock`, `Random`)

### Requires
```javascript
var Handler = require('./mock/handler')
var Util = require('./mock/util')
```

### Module Structure
```javascript
var Random = {
    extend: Util.extend
}
Random.extend(require('./basic'))
// ... more extends
module.exports = Random
```

### JSHint (.jshintrc)
```json
{
    "expr": true,
    "asi": true,
    "strict": false,
    "undef": true,
    "unused": "strict",
    "multistr": true,
    "node": true
}
```
- `unused: "strict"` - no unused variables
- `asi: true` - semicolons optional

### Comments
Chinese comments for function documentation are common:
```javascript
// 返回一个随机的布尔值。
boolean: function(min, max, cur) {
    // 最后一位不能为 0...
}
```

### Testing
- Mocha + Chai (expect syntax)
- Tests in `test/test.mock.*.js`
- Loaded via `test/test.mock.html` (require.js)
```javascript
/* global require, chai, describe, before, it */
var expect = chai.expect

describe('Random', function() {
    before(function(done) { done() })

    function doit(expression, validator) {
        it('', function() {
            var data = eval(expression)
            validator(data)
            this.test.title = expression + ' => ' + JSON.stringify(data)
        })
    }

    doit('Random.boolean()', function(data) {
        expect(data).to.be.a('boolean')
    })
})
```

## Directory Structure
```
src/
    mock.js          # Main entry
    mock/
        handler.js   # Template processing
        parser.js    # Template parsing
        util.js      # Utilities
        random/      # Random generators (index.js, basic.js, date.js, etc.)
        regexp/      # Regex handling
        schema/     # JSON schema
        valid/      # Validation
        xhr/        # XHR interception
test/
    test.mock.*.js   # Test files
    test.mock.html   # Test runner
dist/
    mock.js          # Built output
    mock-min.js      # Minified
```

## Key Patterns
1. **Extending Random**: `Util.extend()` to add methods
2. **Flexible params**: Support multiple argument patterns
3. **Template syntax**: `|rule` for data generation rules
4. **XHR**: Replace `XMLHttpRequest` to intercept requests
5. **UMD build**: Exposes `Mock` as UMD library

## Seed Support
Random data generation supports seeding for reproducible results:
```javascript
// Get current seed
Random.getSeed()

// Set seed (returns Random for chaining)
Random.setSeed(12345)
Random.seed(12345)

// With same seed, generated data is deterministic
Random.setSeed(12345)
Random.natural() // Always returns same value
Random.setSeed(12345)
Random.natural() // Same as above
```

## Notes
- Gulp for automation, Webpack 1.x for bundling
- Tests run in PhantomJS (headless)
- Works in Node.js and browser
