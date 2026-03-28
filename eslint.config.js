import js from '@eslint/js'
import globals from 'globals'

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'no-unused-vars': 'off',
            'no-undef': 'off',
            'no-const-assign': 'error',
            'no-debugger': 'error',
            'no-dupe-else-if': 'error',
            'no-dupe-args': 'error',
            'no-dupe-keys': 'error',
            'no-redeclare': 'off',
            'no-empty': 'off',
            'no-sparse-arrays': 'error',
            'no-unexpected-multiline': 'off',
            'no-unreachable': 'off',
            'no-useless-escape': 'off',
            'no-fallthrough': 'off',
            'no-useless-assignment': 'off',
            'no-prototype-builtins': 'off',
            'no-control-regex': 'off',
            'prefer-const': 'off',
            'semi': 'off',
            'indent': 'off',
            'quotes': 'off',
        },
    },
    {
        files: ['test/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.mocha,
            },
        },
    },
]
