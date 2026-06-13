# AGENTS.md - Mock.js Development Guide

## Overview

Mock.js generates random data and intercepts Ajax requests. Source in `src/` (TypeScript), tests in `test/` (Vitest `.test.ts`), built output in `dist/`.

## Build, Lint, and Test Commands

```bash
# Install dependencies
npm install

# Build dist/mock.js and dist/mock-min.js (Vite library mode, TypeScript → UMD)
npm run build

# Run tests (Vitest)
npm test
npm run test:watch
```

## Code Style Guidelines

### General
- TypeScript with ES5 target, 4-space indentation
- No semicolons
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
    foo: function(this: any, arg: string): string {
        return this.bar(arg)
    }
}
```

### Comments
Chinese comments for function documentation are common:
```typescript
// 返回一个随机的布尔值。
boolean: function(this: any, min?: any, max?: any, cur?: any): boolean {
    // 最后一位不能为 0...
}
```

### Testing (Vitest)
- Tests in `test/*.test.ts`
- Uses `describe`, `it`, `expect` from `vitest`
- Node environment
```typescript
import { describe, it, expect } from 'vitest'
import Mock from '../dist/mock'

describe('Random', () => {
    function doit(expression: string, validator: (data: any) => void) {
        it(`${expression} => ${JSON.stringify(eval(expression))}`, () => {
            validator(eval(expression))
        })
    }

    doit('Random.boolean()', (data) => {
        expect(data).toBeTypeOf('boolean')
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
            index.ts, basic.ts, date.ts, text.ts, web.ts
            name.ts, address.ts (+ address_dict.js)
            color.ts (+ color_dict.ts, color_convert.ts)
            helper.ts, image.ts, misc.ts
        regexp/      # Regex handling
            index.ts, handler.ts
            parser.ts   # Auto-generated PEG (// @ts-nocheck)
        schema/     # JSON schema
        valid/      # Validation
        xhr/        # XHR interception
test/
    *.test.ts        # Vitest test files
dist/
    mock.js          # Built output (UMD)
    mock-min.js      # Minified (+ .map)
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
Random.getSeed()
Random.setSeed(12345)
Random.seed(12345)

// With same seed, generated data is deterministic
Random.setSeed(12345)
Random.natural() // Always returns same value
```

## Notes
- Build: Vite 8 library mode (Rolldown bundler), compiles TypeScript directly
- Tests: Vitest 4 (Node.js, no browser needed)
- Data file `src/mock/random/address_dict.js` is kept as `.js` (not converted to TS)
- Works in Node.js and browser
- **Do NOT auto-commit or auto-push code** - let the user decide when to commit
