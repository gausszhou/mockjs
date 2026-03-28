import { describe, it, expect } from 'vitest'
import Mock from '@/mock.js'

describe('Mock.schema', function() {
    function doit(template, validator) {
        it('validates template', function() {
            var schema = Mock.toJSONSchema(template)
            validator(schema)
        })
    }

    describe('Type', function() {
        doit(1, function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'number')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
        })
        doit(true, function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'boolean')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
        })
        doit('', function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'string')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
        })
        doit(function() {}, function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'function')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
        })
        doit(/\d/, function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'regexp')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
        })
        doit([], function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'array')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
            expect(schema).to.have.property('items').with.length(0)
        })
        doit({}, function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'object')
            for (var n in schema.rule) {
                expect(schema.rule[n]).to.be.null()
            }
            expect(schema).to.have.property('properties').with.length(0)
        })
    })

    describe('Object', function() {
        doit({
            a: {
                b: {
                    c: {
                        d: {}
                    }
                }
            }
        }, function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'object')

            var properties;

            properties = schema.properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('name', 'a')
            expect(properties[0]).to.have.property('type', 'object')

            properties = properties[0].properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('name', 'b')
            expect(properties[0]).to.have.property('type', 'object')

            properties = properties[0].properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('name', 'c')
            expect(properties[0]).to.have.property('type', 'object')

            properties = properties[0].properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('name', 'd')
            expect(properties[0]).to.have.property('type', 'object')

            properties = properties[0].properties
            expect(properties).to.with.length(0)
        })
    })

    describe('Array', function() {
        doit([
            [
                ['foo', 'bar']
            ]
        ], function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'array')

            var items;

            items = schema.items
            expect(items).to.with.length(1)
            expect(items[0]).to.have.property('type', 'array')

            items = items[0].items
            expect(items).to.with.length(1)
            expect(items[0]).to.have.property('type', 'array')

            items = items[0].items
            expect(items).to.with.length(2)
            expect(items[0]).to.have.property('type', 'string')
            expect(items[1]).to.have.property('type', 'string')
        })
    })

    describe('String Rule', function() {
        doit({
            'string|1-10': '★'
        }, function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'object')

            var properties;
            properties = schema.properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('type', 'string')
            expect(properties[0].rule).to.have.property('min', 1)
            expect(properties[0].rule).to.have.property('max', 10)
        })
        doit({
            'string|3': 'value',
        }, function(schema) {
            expect(schema.name).to.be.an('undefined')
            expect(schema).to.have.property('type', 'object')

            var properties;
            properties = schema.properties
            expect(properties).to.with.length(1)
            expect(properties[0]).to.have.property('type', 'string')
            expect(properties[0].rule).to.have.property('min', 3)
            expect(properties[0].rule.max).to.be.an('undefined')
        })
    })

    describe('Mock.toJSONSchema() API', function() {
        it('converts template to JSON schema', function() {
            var template = { name: '@NAME' }
            var schema = Mock.toJSONSchema(template)
            expect(schema).to.be.an('object')
            expect(schema).to.have.property('type', 'object')
        })
    })
})
