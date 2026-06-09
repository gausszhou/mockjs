import { describe, it, expect } from 'vitest'
import Mock from '../dist/mock'

function stringify(json: any) {
    return JSON.stringify(json)
}

function doit(tpl: any, data: any, len: number) {
    it(stringify(tpl) + ' VS ' + stringify(data), () => {
        var result = Mock.valid(tpl, data)
        expect(result).toBeTypeOf('object')
        expect(result).toHaveLength(len)
    })
}

describe('Mock.valid', () => {
    describe('Name', () => {
        doit({ name: 1 }, { name: 1 }, 0)
        doit({ name1: 1 }, { name2: 1 }, 1)
    })
    describe('Value - Number', () => {
        doit({ name: 1 }, { name: 1 }, 0)
        doit({ name: 1 }, { name: 2 }, 1)
        doit({ name: 1.1 }, { name: 2.2 }, 1)
        doit({ 'name|1-10': 1 }, { name: 5 }, 0)
        doit({ 'name|1-10': 1 }, { name: 0 }, 1)
        doit({ 'name|1-10': 1 }, { name: 11 }, 1)
    })
    describe('Value - String', () => {
        doit({ name: 'value' }, { name: 'value' }, 0)
        doit({ name: 'value1' }, { name: 'value2' }, 1)
        doit({ 'name|1': 'value' }, { name: 'value' }, 0)
        doit({ 'name|2': 'value' }, { name: 'valuevalue' }, 0)
        doit({ 'name|2': 'value' }, { name: 'value' }, 1)
        doit({ 'name|2-3': 'value' }, { name: 'value' }, 1)
        doit({ 'name|2-3': 'value' }, { name: 'valuevaluevaluevalue' }, 1)
    })
    describe('Value - RegExp', () => {
        doit({ name: /value/ }, { name: 'value' }, 0)
        doit({ name: /value/ }, { name: 'vvvvv' }, 1)
        doit({ 'name|1-10': /value/ }, { name: 'valuevaluevaluevaluevalue' }, 0)
        doit({ 'name|1-10': /value/ }, { name: 'vvvvvvvvvvvvvvvvvvvvvvvvv' }, 1)
        doit({ 'name|1-10': /^value$/ }, { name: 'valuevaluevaluevaluevalue' }, 0)
        doit({ name: /[a-z][A-Z][0-9]/ }, { name: 'yL5' }, 0)
    })
    describe('Value - Object', () => {
        doit({ name: 1 }, { name: 1 }, 0)
        doit({ name1: 1 }, { name2: 2 }, 1)
        doit({ name1: 1, name2: 2 }, { name3: 3 }, 1)
        doit({ name1: 1, name2: 2 }, { name1: '1', name2: '2' }, 2)
        doit({ a: { b: { c: { d: 1 } } } }, { a: { b: { c: { d: 2 } } } }, 1)
    })
    describe('Value - Array', () => {
        doit([1, 2, 3], [1, 2, 3], 0)
        doit([1, 2, 3], [1, 2, 3, 4], 1)
        doit({ 'name|1': [1, 2, 3] }, { name: 1 }, 0)
        doit({ 'name|1': [1, 2, 3] }, { name: 2 }, 0)
        doit({ 'name|1': [1, 2, 3] }, { name: 3 }, 0)
        doit({ 'name|1': [1, 2, 3] }, { name: 4 }, 0)
        doit({ 'name|+1': [1, 2, 3] }, { name: 1 }, 0)
        doit({ 'name|+1': [1, 2, 3] }, { name: 2 }, 0)
        doit({ 'name|+1': [1, 2, 3] }, { name: 3 }, 0)
        doit({ 'name|+1': [1, 2, 3] }, { name: 4 }, 0)
        doit({ 'name|2-3': [1] }, { name: [1, 2, 3, 4] }, 1)
        doit({ 'name|2-3': [1] }, { name: [1] }, 1)
        doit({ 'name|2-3': [1, 2, 3] }, { name: [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3] }, 1)
        doit({ 'name|2-3': [1, 2, 3] }, { name: [1, 2, 3] }, 1)
        doit({ 'name|2-3': [1] }, { name: [1, 1, 1] }, 0)
        doit({ 'name|2-3': [1] }, { name: [1, 2, 3] }, 2)
    })
    describe('Value - Placeholder', () => {
        doit({ name: '@email' }, { name: 'nuysoft@gmail.com' }, 0)
        doit({ name: '@int' }, { name: 123 }, 0)
    })
})
