import { describe, it, expect } from 'vitest'
import Mock from '../dist/mock'

function stringify(json: any) {
    return JSON.stringify(json)
}

function doit(template: any, validator: (schema: any) => void) {
    it(stringify(template) || String(template), () => {
        var schema = Mock.toJSONSchema(template)
        validator(schema)
    })
}

describe('Schema', () => {
    describe('Type', () => {
        doit(1, (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'number')
            for (var n in schema.rule) {
                expect(schema.rule[n]).toBeNull()
            }
        })
        doit(true, (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'boolean')
            for (var n in schema.rule) {
                expect(schema.rule[n]).toBeNull()
            }
        })
        doit('', (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'string')
            for (var n in schema.rule) {
                expect(schema.rule[n]).toBeNull()
            }
        })
        doit(function() {}, (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'function')
            for (var n in schema.rule) {
                expect(schema.rule[n]).toBeNull()
            }
        })
        doit(/\d/, (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'regexp')
            for (var n in schema.rule) {
                expect(schema.rule[n]).toBeNull()
            }
        })
        doit([], (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'array')
            for (var n in schema.rule) {
                expect(schema.rule[n]).toBeNull()
            }
            expect(schema).toHaveProperty('items')
            expect(schema.items).toHaveLength(0)
        })
        doit({}, (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'object')
            for (var n in schema.rule) {
                expect(schema.rule[n]).toBeNull()
            }
            expect(schema).toHaveProperty('properties')
            expect(schema.properties).toHaveLength(0)
        })
    })
    describe('Object', () => {
        doit({ a: { b: { c: { d: {} } } } }, (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'object')
            var properties
            properties = schema.properties
            expect(properties).toHaveLength(1)
            expect(properties[0]).toHaveProperty('name', 'a')
            expect(properties[0]).toHaveProperty('type', 'object')
            properties = properties[0].properties
            expect(properties).toHaveLength(1)
            expect(properties[0]).toHaveProperty('name', 'b')
            expect(properties[0]).toHaveProperty('type', 'object')
            properties = properties[0].properties
            expect(properties).toHaveLength(1)
            expect(properties[0]).toHaveProperty('name', 'c')
            expect(properties[0]).toHaveProperty('type', 'object')
            properties = properties[0].properties
            expect(properties).toHaveLength(1)
            expect(properties[0]).toHaveProperty('name', 'd')
            expect(properties[0]).toHaveProperty('type', 'object')
            properties = properties[0].properties
            expect(properties).toHaveLength(0)
        })
    })
    describe('Array', () => {
        doit([[['foo', 'bar']]], (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'array')
            var items
            items = schema.items
            expect(items).toHaveLength(1)
            expect(items[0]).toHaveProperty('type', 'array')
            items = items[0].items
            expect(items).toHaveLength(1)
            expect(items[0]).toHaveProperty('type', 'array')
            items = items[0].items
            expect(items).toHaveLength(2)
            expect(items[0]).toHaveProperty('type', 'string')
            expect(items[1]).toHaveProperty('type', 'string')
        })
    })
    describe('String Rule', () => {
        doit({ 'string|1-10': '★' }, (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'object')
            var properties = schema.properties
            expect(properties).toHaveLength(1)
            expect(properties[0]).toHaveProperty('type', 'string')
            expect(properties[0].rule).toHaveProperty('min', 1)
            expect(properties[0].rule).toHaveProperty('max', 10)
        })
        doit({ 'string|3': 'value' }, (schema) => {
            expect(schema.name).toBeTypeOf('undefined')
            expect(schema).toHaveProperty('type', 'object')
            var properties = schema.properties
            expect(properties).toHaveLength(1)
            expect(properties[0]).toHaveProperty('type', 'string')
            expect(properties[0].rule).toHaveProperty('min', 3)
            expect(properties[0].rule.max).toBeUndefined()
        })
    })
})
