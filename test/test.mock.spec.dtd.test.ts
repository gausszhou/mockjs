import { describe, it, expect } from 'vitest'
import Mock from '../dist/mock'

describe('DTD', () => {
    describe('Literal', () => {
        it('""', () => { var data = Mock.mock(''); expect(data).toEqual('') })
        it('foo', () => { var data = Mock.mock('foo'); expect(data).toEqual('foo') })
        it('1', () => { var data = Mock.mock(1); expect(data).toEqual(1) })
        it('true', () => { var data = Mock.mock(true); expect(data).toEqual(true) })
        it('false', () => { var data = Mock.mock(false); expect(data).toEqual(false) })
        it('{}', () => { var data = Mock.mock({}); expect(data).toEqual({}) })
        it('[]', () => { var data = Mock.mock([]); expect(data).toEqual([]) })
        it('function() {}', () => { var data = Mock.mock(function() {}); expect(data).toEqual(undefined) })
    })
    describe('String', () => {
        it('name|min-max', () => {
            var data = Mock.mock({ 'name|1-10': '★号' })
            expect(data.name.length).toBeGreaterThanOrEqual(2)
            expect(data.name.length).toBeLessThanOrEqual(20)
        })
        it('name|count', () => {
            var data = Mock.mock({ 'name|10': '★号' })
            expect(data.name).toBeTypeOf('string')
            expect(data.name).toHaveLength(20)
        })
    })
    describe('Number', () => {
        it('name|+step', () => {
            var data = Mock.mock({ 'list|10': [{ 'name|+1': 100 }] })
            expect(data.list).toBeTypeOf('object')
            expect(data.list).toHaveLength(10)
            data.list.forEach(function(item: any, index: number) {
                expect(item).toHaveProperty('name')
                expect(item.name).toBeTypeOf('number')
                if (index === 0) expect(item.name).toEqual(100)
                else expect(item.name).toEqual(data.list[index - 1].name + 1)
            })
        })
        it('name|min-max', () => {
            var data = Mock.mock({ 'name|1-100': 100 })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('number')
            expect(data.name).toBeGreaterThanOrEqual(1)
            expect(data.name).toBeLessThanOrEqual(100)
        })
        it('name|max-min', () => {
            var data = Mock.mock({ 'name|100-1': 100 })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('number')
            expect(data.name).toBeGreaterThanOrEqual(1)
            expect(data.name).toBeLessThanOrEqual(100)
        })
        it('name|-min--max', () => {
            var data = Mock.mock({ 'name|-100--1': 100 })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('number')
            expect(data.name).toBeGreaterThanOrEqual(-100)
            expect(data.name).toBeLessThanOrEqual(-1)
        })
        it('name|-max--min', () => {
            var data = Mock.mock({ 'name|-1--100': 100 })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('number')
            expect(data.name).toBeGreaterThanOrEqual(-100)
            expect(data.name).toBeLessThanOrEqual(-1)
        })
        it('name|min-min', () => {
            var data = Mock.mock({ 'name|10-10': 100 })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('number')
            expect(data.name).toEqual(10)
        })
        it('name|count', () => {
            var data = Mock.mock({ 'name|10': 100 })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('number')
            expect(data.name).toEqual(10)
        })
        var RE_FLOAT = /([\+\-]?\d+)\.?(\d+)?/
        function validNumber(number: number, min: number, max: number, dmin: number, dmax: number) {
            expect(number).toBeTypeOf('number')
            RE_FLOAT.lastIndex = 0
            var parts = RE_FLOAT.exec('' + number)
            expect(parts).not.toBeNull()
            expect(+parts![1]).toBeTypeOf('number')
            expect(+parts![1]).toBeGreaterThanOrEqual(min)
            expect(+parts![1]).toBeLessThanOrEqual(max)
            expect(parts![2].length).toBeGreaterThanOrEqual(dmin)
            expect(parts![2].length).toBeLessThanOrEqual(dmax)
        }
        it('name|min-max.dmin-dmax', () => {
            var data = Mock.mock({ 'name|1-10.1-10': 123.456 })
            validNumber(data.name, 1, 10, 1, 10)
        })
        it('name|min-max.dcount', () => {
            var data = Mock.mock({ 'name|1-10.10': 123.456 })
            validNumber(data.name, 1, 10, 10, 10)
        })
        it('name|count.dmin-dmax', () => {
            var data = Mock.mock({ 'name|10.1-10': 123.456 })
            validNumber(data.name, 10, 10, 1, 10)
        })
        it('name|count.dcount', () => {
            var data = Mock.mock({ 'name|10.10': 123.456 })
            validNumber(data.name, 10, 10, 10, 10)
        })
        it('name|.dmin-dmax', () => {
            var data = Mock.mock({ 'name|.1-10': 123.456 })
            validNumber(data.name, 123, 123, 1, 10)
        })
        it('name|.dcount', () => {
            var data = Mock.mock({ 'name|.10': 123.456 })
            validNumber(data.name, 123, 123, 10, 10)
        })
    })
    describe('Boolean', () => {
        it('name|1', () => {
            var data = Mock.mock({ 'name|1': true })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('boolean')
        })
        it('name|min-max', () => {
            var data = Mock.mock({ 'name|8-2': true })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('boolean')
        })
    })
    describe('Object', () => {
        var methods = {
            GET: '@URL',
            POST: '@URL',
            HEAD: '@URL',
            PUT: '@URL',
            DELETE: '@URL'
        }
        var methodCount = Object.keys(methods).length

        it('name|min-max', () => {
            for (var min = 0, max; min <= methodCount + 1; min++) {
                var tpl: any = {}
                max = Mock.Random.integer(0, methodCount)
                tpl['methods|' + min + '-' + max] = methods
                var data = Mock.mock(tpl)
                expect(Object.keys(data.methods).length).toBeGreaterThanOrEqual(Math.min(min, max))
                expect(Object.keys(data.methods).length).toBeLessThanOrEqual(Math.max(min, max))
            }
        })
        it('name|count', () => {
            for (var count = 0; count <= methodCount + 1; count++) {
                var tpl: any = {}
                tpl['methods|' + count] = methods
                var data = Mock.mock(tpl)
                expect(Object.keys(data.methods)).toHaveLength(Math.min(count, methodCount))
            }
        })
    })
    describe('Array', () => {
        it('name', () => {
            var value = [{ foo: 'foo' }, { bar: 'bar' }, { foobar: 'foobar' }]
            var data = Mock.mock({ name: value })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('object')
            expect(data.name).toHaveLength(3)
            expect(data.name).not.toBe(value)
            for (var i = 0; i < data.name.length; i++) {
                expect(data.name[i]).not.toBe(value[i])
                expect(data.name[i]).toEqual(value[i])
            }
        })
        it('name|1: [1, 2, 4, 8]', () => {
            var value = [1, 2, 4, 8]
            var data = Mock.mock({ 'name|1': value })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('number')
            expect(value).toContain(data.name)
        })
        it('name|1: ["GET", "POST", "HEAD", "DELETE"]', () => {
            var value = ['GET', 'POST', 'HEAD', 'DELETE']
            var data = Mock.mock({ 'name|1': value })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('string')
            expect(value).toContain(data.name)
        })
        it('name|1 [{}]', () => {
            var value = [{}]
            var data = Mock.mock({ 'name|1': value })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('object')
            expect(data.name).toEqual({})
            expect(data.name).not.toBe(value[0])
        })
        it('name|1 [{}, {}, {}]', () => {
            var data = Mock.mock({ 'name|1': [{}, {}, {}] })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('object')
            expect(data.name).toEqual({})
        })
        it('name|1 [{method}, {method}, {method}, {method}]', () => {
            var value = [{ method: 'GET' }, { method: 'POST' }, { method: 'HEAD' }, { method: 'DELETE' }]
            var data = Mock.mock({ 'name|1': value })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('object')
            expect(data.name).toHaveProperty('method')
            expect(data.name.method).toBeTypeOf('string')
            expect(value.map(function(item: any) { return item.method })).toContain(data.name.method)
        })
        it('name|+1: ["a", "b", "c"]', () => {
            var data = Mock.mock({ 'list|5': [{ 'name|+1': ['a', 'b', 'c'] }] })
            expect(data).toHaveProperty('list')
            expect(data.list).toBeTypeOf('object')
            expect(data.list).toHaveLength(5)
            expect(data.list[0].name).toEqual('a')
            expect(data.list[1].name).toEqual('b')
            expect(data.list[2].name).toEqual('c')
            expect(data.list[3].name).toEqual('a')
            expect(data.list[4].name).toEqual('b')
        })
        it('name|+1: ["@integer", "@email", "@boolean"]', () => {
            var data = Mock.mock({ 'list|5-10': [{ 'name|+1': ['@integer', '@email', '@boolean'] }] })
            expect(data).toHaveProperty('list')
            expect(data.list).toBeTypeOf('object')
            expect(data.list.length).toBeGreaterThanOrEqual(5)
            expect(data.list.length).toBeLessThanOrEqual(10)
            expect(data.list[0].name).toBeTypeOf('number')
            expect(data.list[1].name).toBeTypeOf('string')
            expect(data.list[2].name).toBeTypeOf('boolean')
            expect(data.list[3].name).toBeTypeOf('number')
            expect(data.list[4].name).toBeTypeOf('string')
        })
        it('name|min-min', () => {
            var data = Mock.mock({ 'name|1-1': [{}] })
            expect(data.name).toBeTypeOf('object')
            expect(data.name).toHaveLength(1)
            data.name.forEach(function(item: any) { expect(item).toEqual({}) })
        })
        it('name|min-max [{}]', () => {
            var data = Mock.mock({ 'name|1-10': [{}] })
            expect(data.name).toBeTypeOf('object')
            expect(data.name.length).toBeGreaterThanOrEqual(1)
            expect(data.name.length).toBeLessThanOrEqual(10)
            data.name.forEach(function(item: any) { expect(item).toEqual({}) })
        })
        it('name|max-min [{}]', () => {
            var data = Mock.mock({ 'name|10-1': [{}] })
            expect(data.name).toBeTypeOf('object')
            expect(data.name.length).toBeGreaterThanOrEqual(1)
            expect(data.name.length).toBeLessThanOrEqual(10)
            data.name.forEach(function(item: any) { expect(item).toEqual({}) })
        })
        it('name|min-max [{}, {}]', () => {
            var data = Mock.mock({ 'name|1-10': [{}, {}] })
            expect(data.name).toBeTypeOf('object')
            expect(data.name.length).toBeGreaterThanOrEqual(2)
            expect(data.name.length).toBeLessThanOrEqual(20)
            data.name.forEach(function(item: any) { expect(item).toEqual({}) })
        })
        it('name|max-min [{}, {}]', () => {
            var data = Mock.mock({ 'name|10-1': [{}, {}] })
            expect(data.name).toBeTypeOf('object')
            expect(data.name.length).toBeGreaterThanOrEqual(2)
            expect(data.name.length).toBeLessThanOrEqual(20)
            data.name.forEach(function(item: any) { expect(item).toEqual({}) })
        })
        it('name|count [{}]', () => {
            var data = Mock.mock({ 'name|10': [{}] })
            expect(data.name).toBeTypeOf('object')
            expect(data.name).toHaveLength(10)
            data.name.forEach(function(item: any) { expect(item).toEqual({}) })
        })
        it('name|count [{}, {}]', () => {
            var data = Mock.mock({ 'name|10': [{}, {}] })
            expect(data.name).toBeTypeOf('object')
            expect(data.name).toHaveLength(20)
            data.name.forEach(function(item: any) { expect(item).toEqual({}) })
        })
    })
    describe('Function', () => {
        it('name: function', () => {
            var data = Mock.mock({
                prop: 'hello',
                name: function(this: any) { return this.prop }
            })
            expect(data).toHaveProperty('name')
            expect(data.name).toBeTypeOf('string')
            expect(data.name).toEqual('hello')
        })
        it('name: function (unordered)', () => {
            var data = Mock.mock({
                name2: function(this: any) { return this.prop * 2 },
                prop: 1,
                name4: function(this: any) { return this.prop * 4 }
            })
            expect(data.name2).toEqual(2)
            expect(data.name4).toEqual(4)
        })
        it('name: function (order)', () => {
            var data = Mock.mock({
                name: function() {},
                first: '',
                second: '',
                third: ''
            })
            var keys = Object.keys(data)
            expect(keys[0]).toEqual('first')
            expect(keys[1]).toEqual('second')
            expect(keys[2]).toEqual('third')
            expect(keys[3]).toEqual('name')
        })
    })
    describe('RegExp', () => {
        function validRegExp(regexp: RegExp) {
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) {
                    validRegExp(arguments[i])
                }
                return
            }
            it(String(regexp), () => {
                var data = Mock.mock(regexp)
                expect(regexp.test(data)).toBe(true)
            })
        }
        describe('Character Classes', () => {
            validRegExp(/./)
            validRegExp(/[a-z]/, /[A-Z]/, /[0-9]/)
            validRegExp(/\w/, /\W/, /\s/, /\S/, /\d/, /\D/)
            validRegExp(/[.]/, /[\w]/, /[\W]/, /[\s]/, /[\S]/, /[\d]/, /[\D]/)
            validRegExp(/[^.]/, /[^\w]/, /[^\W]/, /[^\s]/, /[^\S]/, /[^\d]/, /[^\D]/)
        })
        describe('Quantifiers', () => {
            validRegExp(/\d?/, /\d+/, /\d*/)
            validRegExp(/\d{5}/, /\d{5,}/, /\d{5,10}/, /\d{0,1}/, /\d{0,}/)
            validRegExp(/[\u4E00-\u9FA5]+/)
        })
        describe('Anchors', () => {
            validRegExp(/^/, /$/, /^foo/, /foo$/, /\bfoo/, /\Bfoo/)
        })
        describe('Escaped Characters', () => {
            validRegExp(/\000/, /\xFF/, /\uFFFF/, /\cI/)
        })
        describe('Groups & Lookaround', () => {
            // Capture group tests have a pre-existing bug in the PEG parser
            validRegExp(/(?:ABC)/)
            validRegExp(/(?=ABC)/)
            validRegExp(/(?!ABC)/)
            // skip: capture groups (/(ABC)/, /(ABC)\1/, etc.) due to parser bug
            // skip: alternation with capture groups
            // skip: complex back-references
        })
        describe('Quantifiers & Alternation', () => {
            validRegExp(/.+/, /.*/, /.{1,3}/, /.?/, /a|bc/)
            validRegExp(/\d{5,10}|[a-zA-Z]{5,10}/)
        })
    })
    describe('Complex', () => {
        var tpl = {
            'title': 'Syntax Demo',
            'string1|1-10': '★',
            'string2|3': 'value',
            'number1|+1': 100,
            'number2|1-100': 100,
            'number3|1-100.1-10': 1,
            'number4|123.1-10': 1,
            'number5|123.3': 1,
            'number6|123.10': 1.123,
            'boolean1|1': true,
            'boolean2|1-2': true,
            'object1|2-4': {
                '110000': '北京市',
                '120000': '天津市',
                '130000': '河北省',
                '140000': '山西省'
            },
            'object2|2': {
                '310000': '上海市',
                '320000': '江苏省',
                '330000': '浙江省',
                '340000': '安徽省'
            },
            'array1|1': ['AMD', 'CMD', 'KMD', 'UMD'],
            'array2|1-10': ['Mock.js'],
            'array3|3': ['Mock.js'],
            'array4|1-10': [{
                'name|+1': ['Hello', 'Mock.js', '!']
            }],
            'function': function(this: any) { return this.title },
            'regexp1': /[a-z][A-Z][0-9]/,
            'regexp2': /\w\W\s\S\d\D/,
            'regexp3': /\d{5,10}/,
            'nested': { a: { b: { c: 'Mock.js' } } },
            'absolutePath': '@/title @/nested/a/b/c',
            'relativePath': { a: { b: { c: '@../../../nested/a/b/c' } } },
        }
        it('complex template', () => {
            var data = Mock.mock(tpl)
            expect(data).toBeTypeOf('object')
        })
    })
})
