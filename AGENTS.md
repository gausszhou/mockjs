# AGENTS.md - Mock.js Development Guide

## Overview

Mock.js generates random data and intercepts Ajax requests. Source in `src/` (TypeScript), intermediate JS in `tsbuild/`, tests in `test/`, built output in `dist/`.

## Build, Lint, and Test Commands

```bash
# Install dependencies (use npm)
npm install

# Compile TypeScript to JS (outputs to tsbuild/)
npx tsc

# Build dist/mock.js and dist/mock-min.js (compiles TS + bundles with webpack)
npx gulp tscbuild
# Or manually:
#   npx tsc
#   cp src/mock/random/address_dict.js tsbuild/mock/random/address_dict.js
#   node -e "var w=require('webpack'),p=require('path'); \
#     w({entry:'./tsbuild/mock.js',output:{path:p.join(__dirname,'dist'),filename:'mock.js',library:'Mock',libraryTarget:'umd'}},function(){}); \
#     w({entry:'./tsbuild/mock.js',devtool:'source-map',output:{path:p.join(__dirname,'dist'),filename:'mock-min.js',library:'Mock',libraryTarget:'umd'},plugins:[new w.optimize.UglifyJsPlugin({minimize:true})]},function(){});"

# Run tests (Mocha + PhantomJS — may need local server)
gulp mocha
# Or with Puppeteer:
node test/run.js

# Lint only
gulp jshint

# Build (lint + webpack + tests)
gulp build

# Build webpack only
gulp webpack

# Dev server on port 5050 with watch
gulp
```

**Note**: Gulp 3.x has `primordials` errors on Node.js >= 12. Use the manual build commands above if gulp fails.

**Running a single test**: Edit `test/test.mock.html` to load only specific test files, or modify the test file directly to run specific cases.

## TypeScript Conversion Notes

### Source files
- All source code in `src/` is now TypeScript (`.ts`)
- Auto-generated PEG parser `src/mock/regexp/parser.ts` uses `// @ts-nocheck`
- Data dictionary files: `address_dict.js` must be manually copied from `src/` to `tsbuild/` after tsc

### Build pipeline
1. `npx tsc` compiles `.ts` → `.js` in `tsbuild/`
2. Webpack bundles `tsbuild/mock.js` → `dist/mock.js` (UMD format)
3. `address_dict.js` needs to be copied because it's a `.js` data file not processed by tsc

### Seed support fix
The `Basic` module's `_random` is synced with `Random._random` during initialization and `seed()` calls. This ensures that direct calls like `Basic.natural()` from `text.ts` use the correct random instance.

## Code Style Guidelines

### General
- TypeScript with ES5 target, 4-space indentation
- No semicolons (ASI enabled in `.jshintrc`)
- CommonJS modules (`export = ...` / `require(...)`)

### File Headers
```typescript
/* global require, module, window */
```

### Naming
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: lowercase with dots
- Modules: Capitalized (`Mock`, `Random`)

### Requires
```typescript
var Handler = require('./mock/handler')
var Util = require('./mock/util')
```

### Module Structure
```typescript
export = {
    // methods use `this: any` parameter for JS-style this typing
    foo: function(this: any, arg: string): string {
        return this.bar(arg)
    }
}
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
```typescript
// 返回一个随机的布尔值。
boolean: function(this: any, min?: any, max?: any, cur?: any): boolean {
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
    mock.ts          # Main entry (TS)
    mock/
        handler.ts   # Template processing
        parser.ts    # Template parsing
        util.ts      # Utilities
        types.ts     # Shared TypeScript interfaces
        random/      # Random generators (TS)
            index.ts
            basic.ts
            date.ts
            text.ts
            web.ts
            name.ts
            address.ts (+ address_dict.js)
            color.ts (+ color_dict.js, color_convert.ts)
            helper.ts
            image.ts
            misc.ts
        regexp/      # Regex handling
            index.ts
            handler.ts
            parser.ts   # Auto-generated (// @ts-nocheck)
        schema/     # JSON schema
        valid/      # Validation
        xhr/        # XHR interception
tsbuild/            # Intermediate JS output from tsc
    mock.js
    mock/
        handler.js
        random/
        ...
test/
    test.mock.*.js   # Test files
    test.mock.html   # Test runner
dist/
    mock.js          # Built output (UMD)
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
```typescript
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
- Gulp 3.x broken on Node >= 12 (`primordials` error); use manual commands
- Tests typically run in PhantomJS, but `puppeteer` is available as alternative
- Works in Node.js and browser
- **Do NOT auto-commit or auto-push code** - let the user decide when to commit
- After `npx tsc`, run: `cp src/mock/random/address_dict.js tsbuild/mock/random/address_dict.js`
