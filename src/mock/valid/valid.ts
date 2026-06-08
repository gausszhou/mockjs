var Constant = require('../constant')
var Util = require('../util')
var toJSONSchema = require('../schema')

function valid(template: any, data: any): any[] {
    var schema = toJSONSchema(template)
    var result = Diff.diff(schema, data)
    for (var i = 0; i < result.length; i++) {
    }
    return result
}

var Diff: any = {
    diff: function diff(schema: any, data: any, name?: any): any[] {
        var result: any[] = []

        if (
            this.name(schema, data, name, result) &&
            this.type(schema, data, name, result)
        ) {
            this.value(schema, data, name, result)
            this.properties(schema, data, name, result)
            this.items(schema, data, name, result)
        }

        return result
    },
    name: function(schema: any, data: any, name: any, result: any[]): boolean {
        var length = result.length

        Assert.equal('name', schema.path, name + '', schema.name + '', result)

        return result.length === length
    },
    type: function(schema: any, data: any, name: any, result: any[]): boolean {
        var length = result.length

        switch (schema.type) {
            case 'string':
                if (schema.template.match(Constant.RE_PLACEHOLDER)) return true
                break
            case 'array':
                if (schema.rule.parameters) {
                    if (schema.rule.min !== undefined && schema.rule.max === undefined) {
                        if (schema.rule.count === 1) return true
                    }
                    if (schema.rule.parameters[2]) return true
                }
                break
            case 'function':
                return true
        }

        Assert.equal('type', schema.path, Util.type(data), schema.type, result)

        return result.length === length
    },
    value: function(schema: any, data: any, name: any, result: any[]): boolean {
        var length = result.length

        var rule = schema.rule
        var templateType = schema.type
        if (templateType === 'object' || templateType === 'array' || templateType === 'function') return true

        if (!rule.parameters) {
            switch (templateType) {
                case 'regexp':
                    Assert.match('value', schema.path, data, schema.template, result)
                    return result.length === length
                case 'string':
                    if (schema.template.match(Constant.RE_PLACEHOLDER)) return result.length === length
                    break
            }
            Assert.equal('value', schema.path, data, schema.template, result)
            return result.length === length
        }

        var actualRepeatCount: any
        switch (templateType) {
            case 'number':
                var parts: any = (data + '').split('.')
                parts[0] = +parts[0]

                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo('value', schema.path, parts[0], Math.min(rule.min, rule.max), result)
                    Assert.lessThanOrEqualTo('value', schema.path, parts[0], Math.max(rule.min, rule.max), result)
                }
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal('value', schema.path, parts[0], rule.min, result, '[value] ' + name)
                }

                if (rule.decimal) {
                    if (rule.dmin !== undefined && rule.dmax !== undefined) {
                        Assert.greaterThanOrEqualTo('value', schema.path, parts[1].length, rule.dmin, result)
                        Assert.lessThanOrEqualTo('value', schema.path, parts[1].length, rule.dmax, result)
                    }
                    if (rule.dmin !== undefined && rule.dmax === undefined) {
                        Assert.equal('value', schema.path, parts[1].length, rule.dmin, result)
                    }
                }

                break

            case 'boolean':
                break

            case 'string':
                actualRepeatCount = data.match(new RegExp(schema.template, 'g'))
                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0

                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result)
                    Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result)
                }
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result)
                }

                break

            case 'regexp':
                actualRepeatCount = data.match(new RegExp(schema.template.source.replace(/^\^|\$$/g, ''), 'g'))
                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0

                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result)
                    Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result)
                }
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result)
                }
                break
        }

        return result.length === length
    },
    properties: function(schema: any, data: any, name: any, result: any[]): boolean {
        var length = result.length

        var rule = schema.rule
        var keys = Util.keys(data)
        if (!schema.properties) return true

        if (!schema.rule.parameters) {
            Assert.equal('properties length', schema.path, keys.length, schema.properties.length, result)
        } else {
            if (rule.min !== undefined && rule.max !== undefined) {
                Assert.greaterThanOrEqualTo('properties length', schema.path, keys.length, Math.min(rule.min, rule.max), result)
                Assert.lessThanOrEqualTo('properties length', schema.path, keys.length, Math.max(rule.min, rule.max), result)
            }
            if (rule.min !== undefined && rule.max === undefined) {
                if (rule.count !== 1) Assert.equal('properties length', schema.path, keys.length, rule.min, result)
            }
        }

        if (result.length !== length) return false

        for (var i = 0; i < keys.length; i++) {
            result.push.apply(
                result,
                this.diff(
                    (function() {
                        var property: any
                        Util.each(schema.properties, function(item: any) {
                            if (item.name === keys[i]) property = item
                        })
                        return property || schema.properties[i]
                    })(),
                    data[keys[i]],
                    keys[i]
                )
            )
        }

        return result.length === length
    },
    items: function(schema: any, data: any, name: any, result: any[]): boolean {
        var length = result.length

        if (!schema.items) return true

        var rule = schema.rule

        if (!schema.rule.parameters) {
            Assert.equal('items length', schema.path, data.length, schema.items.length, result)
        } else {
            if (rule.min !== undefined && rule.max !== undefined) {
                Assert.greaterThanOrEqualTo('items', schema.path, data.length, (Math.min(rule.min, rule.max) * schema.items.length), result,
                    '[{utype}] array is too short: {path} must have at least {expected} elements but instance has {actual} elements')
                Assert.lessThanOrEqualTo('items', schema.path, data.length, (Math.max(rule.min, rule.max) * schema.items.length), result,
                    '[{utype}] array is too long: {path} must have at most {expected} elements but instance has {actual} elements')
            }
            if (rule.min !== undefined && rule.max === undefined) {
                if (rule.count === 1) return result.length === length
                else Assert.equal('items length', schema.path, data.length, (rule.min * schema.items.length), result)
            }
            if (rule.parameters[2]) return result.length === length
        }

        if (result.length !== length) return false

        for (var i = 0; i < data.length; i++) {
            result.push.apply(
                result,
                this.diff(
                    schema.items[i % schema.items.length],
                    data[i],
                    i % schema.items.length
                )
            )
        }

        return result.length === length
    }
}

var Assert: any = {
    message: function(item: any): string {
        return (item.message ||
                '[{utype}] Expect {path}\'{ltype} {action} {expected}, but is {actual}')
            .replace('{utype}', item.type.toUpperCase())
            .replace('{ltype}', item.type.toLowerCase())
            .replace('{path}', Util.isArray(item.path) && item.path.join('.') || item.path)
            .replace('{action}', item.action)
            .replace('{expected}', item.expected)
            .replace('{actual}', item.actual)
    },
    equal: function(type: string, path: any, actual: any, expected: any, result: any[], message?: string): boolean {
        if (actual === expected) return true
        switch (type) {
            case 'type':
                if (expected === 'regexp' && actual === 'string') return true
                break
        }

        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    match: function(type: string, path: any, actual: any, expected: any, result: any[], message?: string): boolean {
        if (expected.test(actual)) return true

        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'matches',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    notEqual: function(type: string, path: any, actual: any, expected: any, result: any[], message?: string): boolean {
        if (actual !== expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is not equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    greaterThan: function(type: string, path: any, actual: any, expected: any, result: any[], message?: string): boolean {
        if (actual > expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is greater than',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    lessThan: function(type: string, path: any, actual: any, expected: any, result: any[], message?: string): boolean {
        if (actual < expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is less to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    greaterThanOrEqualTo: function(type: string, path: any, actual: any, expected: any, result: any[], message?: string): boolean {
        if (actual >= expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is greater than or equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    lessThanOrEqualTo: function(type: string, path: any, actual: any, expected: any, result: any[], message?: string): boolean {
        if (actual <= expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is less than or equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    }
}

valid.Diff = Diff
valid.Assert = Assert

export = valid
