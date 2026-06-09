import { describe, it, expect } from 'vitest'
import Mock from '../dist/mock'

const Random = Mock.Random

function stringify(json: any) {
    return JSON.stringify(json)
}

function doit(expression: string, validator: (data: any) => void) {
    it(expression, () => {
        var data = eval(expression)
        validator(data)
    })
}

describe('Random', () => {
    describe('Basic', () => {
        doit('Random.boolean()', (data) => {
            expect(data).toBeTypeOf('boolean')
        })

        doit('Random.natural()', (data) => {
            expect(data).toBeTypeOf('number')
            expect(data).toBeGreaterThanOrEqual(0)
            expect(data).toBeLessThanOrEqual(9007199254740992)
        })
        doit('Random.natural(1, 3)', (data) => {
            expect(data).toBeTypeOf('number')
            expect(data).toBeGreaterThanOrEqual(1)
            expect(data).toBeLessThanOrEqual(3)
        })
        doit('Random.natural(1)', (data) => {
            expect(data).toBeTypeOf('number')
            expect(data).toBeGreaterThanOrEqual(1)
        })

        doit('Random.integer()', (data) => {
            expect(data).toBeTypeOf('number')
            expect(data).toBeGreaterThanOrEqual(-9007199254740992)
            expect(data).toBeLessThanOrEqual(9007199254740992)
        })
        doit('Random.integer(-10, 10)', (data) => {
            expect(data).toBeTypeOf('number')
            expect(data).toBeGreaterThanOrEqual(-10)
            expect(data).toBeLessThanOrEqual(10)
        })

        var RE_FLOAT = /(\-?\d+)\.?(\d+)?/

        function validFloat(float: number, min: number, max: number, dmin: number, dmax: number) {
            RE_FLOAT.lastIndex = 0
            var parts = RE_FLOAT.exec(float + '')
            expect(parts).not.toBeNull()
            expect(+parts![1]).toBeTypeOf('number')
            expect(+parts![1]).toBeGreaterThanOrEqual(min)
            expect(+parts![1]).toBeLessThanOrEqual(max)
            if (parts![2] != undefined) {
                expect(parts![2].length).toBeGreaterThanOrEqual(dmin)
                expect(parts![2].length).toBeLessThanOrEqual(dmax)
            }
        }

        doit('Random.float()', (data) => {
            validFloat(data, -9007199254740992, 9007199254740992, 0, 17)
        })
        doit('Random.float(0)', (data) => {
            validFloat(data, 0, 9007199254740992, 0, 17)
        })
        doit('Random.float(60, 100)', (data) => {
            validFloat(data, 60, 100, 0, 17)
        })
        doit('Random.float(60, 100, 3)', (data) => {
            validFloat(data, 60, 100, 3, 17)
        })
        doit('Random.float(60, 100, 3, 5)', (data) => {
            validFloat(data, 60, 100, 3, 5)
        })

        var CHARACTER_LOWER = 'abcdefghijklmnopqrstuvwxyz'
        var CHARACTER_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var CHARACTER_NUMBER = '0123456789'
        var CHARACTER_SYMBOL = '!@#$%^&*()[]'
        doit('Random.character()', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data).toHaveLength(1)
            expect(
                CHARACTER_LOWER +
                CHARACTER_UPPER +
                CHARACTER_NUMBER +
                CHARACTER_SYMBOL
            ).toContain(data)
        })
        doit('Random.character("lower")', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data).toHaveLength(1)
            expect(CHARACTER_LOWER).toContain(data)
        })
        doit('Random.character("upper")', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data).toHaveLength(1)
            expect(CHARACTER_UPPER).toContain(data)
        })
        doit('Random.character("number")', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data).toHaveLength(1)
            expect(CHARACTER_NUMBER).toContain(data)
        })
        doit('Random.character("symbol")', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data).toHaveLength(1)
            expect(CHARACTER_SYMBOL).toContain(data)
        })
        doit('Random.character("aeiou")', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data).toHaveLength(1)
            expect('aeiou').toContain(data)
        })

        doit('Random.string()', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data.length).toBeGreaterThanOrEqual(3)
            expect(data.length).toBeLessThanOrEqual(7)
        })
        doit('Random.string(5)', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data).toHaveLength(5)
        })
        doit('Random.string("lower", 5)', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data).toHaveLength(5)
            for (var i = 0; i < data.length; i++) {
                expect(CHARACTER_LOWER).toContain(data[i])
            }
        })
        doit('Random.string(7, 10)', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data.length).toBeGreaterThanOrEqual(7)
            expect(data.length).toBeLessThanOrEqual(10)
        })
        doit('Random.string("aeiou", 1, 3)', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data.length).toBeGreaterThanOrEqual(1)
            expect(data.length).toBeLessThanOrEqual(3)
            for (var i = 0; i < data.length; i++) {
                expect('aeiou').toContain(data[i])
            }
        })

        doit('Random.range(10)', (data) => {
            expect(data).toBeTypeOf('object')
            expect(data).toHaveLength(10)
        })
        doit('Random.range(3, 7)', (data) => {
            expect(data).toEqual([3, 4, 5, 6])
        })
        doit('Random.range(1, 10, 2)', (data) => {
            expect(data).toEqual([1, 3, 5, 7, 9])
        })
        doit('Random.range(1, 10, 3)', (data) => {
            expect(data).toEqual([1, 4, 7])
        })

        var RE_DATE = /\d{4}-\d{2}-\d{2}/
        var RE_TIME = /\d{2}:\d{2}:\d{2}/
        var RE_DATETIME = new RegExp(RE_DATE.source + ' ' + RE_TIME.source)

        doit('Random.date()', (data) => {
            expect(RE_DATE.test(data)).toBe(true)
        })

        doit('Random.time()', (data) => {
            expect(RE_TIME.test(data)).toBe(true)
        })

        doit('Random.datetime()', (data) => {
            expect(RE_DATETIME.test(data)).toBe(true)
        })
        doit('Random.datetime("yyyy-MM-dd A HH:mm:ss")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.datetime("yyyy-MM-dd a HH:mm:ss")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.datetime("yy-MM-dd HH:mm:ss")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.datetime("y-MM-dd HH:mm:ss")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.datetime("y-M-d H:m:s")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.datetime("yyyy yy y MM M dd d HH H hh h mm m ss s SS S A a T")', (data) => {
            expect(data).toBeTruthy()
        })

        doit('Random.now()', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.now("year")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.now("month")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.now("day")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.now("hour")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.now("minute")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.now("second")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.now("week")', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.now("yyyy-MM-dd HH:mm:ss SS")', (data) => {
            expect(data).toBeTruthy()
        })
    })

    describe('Image', () => {
        doit('Random.image()', (data) => {
            expect(data).toBeTruthy()
        })
        // dataImage needs browser canvas or Node canvas module
        it.skip('Random.dataImage()', () => {
            var data = Random.dataImage()
            expect(data).toBeTruthy()
        })
        it.skip('Random.dataImage("200x100")', () => {
            var data = Random.dataImage('200x100')
            expect(data).toBeTruthy()
        })
        it.skip('Random.dataImage("200x100", "Hello Mock.js!")', () => {
            var data = Random.dataImage('200x100', 'Hello Mock.js!')
            expect(data).toBeTruthy()
        })
    })

    var RE_COLOR = /^#[0-9a-fA-F]{6}$/
    var RE_COLOR_RGB = /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/
    var RE_COLOR_RGBA = /^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, 0\.\d{1,2}\)$/
    var RE_COLOR_HSL = /^hsl\(\d{1,3}, \d{1,3}, \d{1,3}\)$/
    describe('Color', () => {
        doit('Random.color()', (data) => {
            expect(RE_COLOR.test(data)).toBe(true)
        })
        doit('Random.hex()', (data) => {
            expect(RE_COLOR.test(data)).toBe(true)
        })
        doit('Random.rgb()', (data) => {
            expect(RE_COLOR_RGB.test(data)).toBe(true)
        })
        doit('Random.rgba()', (data) => {
            expect(RE_COLOR_RGBA.test(data)).toBe(true)
        })
        doit('Random.hsl()', (data) => {
            expect(RE_COLOR_HSL.test(data)).toBe(true)
        })
    })

    describe('Text', () => {
        doit('Random.paragraph()', (data) => {
            expect(data.split('.').length - 1).toBeGreaterThanOrEqual(3)
            expect(data.split('.').length - 1).toBeLessThanOrEqual(7)
        })
        doit('Random.paragraph(2)', (data) => {
            expect(data.split('.').length - 1).toEqual(2)
        })
        doit('Random.paragraph(1, 3)', (data) => {
            expect(data.split('.').length - 1).toBeGreaterThanOrEqual(1)
            expect(data.split('.').length - 1).toBeLessThanOrEqual(3)
        })

        doit('Random.sentence()', (data) => {
            expect(data[0]).toEqual(data.toUpperCase()[0])
            expect(data.split(' ').length).toBeGreaterThanOrEqual(12)
            expect(data.split(' ').length).toBeLessThanOrEqual(18)
        })
        doit('Random.sentence(4)', (data) => {
            expect(data[0]).toEqual(data.toUpperCase()[0])
            expect(data.split(' ').length).toEqual(4)
        })
        doit('Random.sentence(3, 5)', (data) => {
            expect(data[0]).toEqual(data.toUpperCase()[0])
            expect(data.split(' ').length).toBeGreaterThanOrEqual(3)
            expect(data.split(' ').length).toBeLessThanOrEqual(5)
        })

        doit('Random.word()', (data) => {
            expect(data.length).toBeGreaterThanOrEqual(3)
            expect(data.length).toBeLessThanOrEqual(10)
        })
        doit('Random.word(4)', (data) => {
            expect(data).toHaveLength(4)
        })
        doit('Random.word(3, 5)', (data) => {
            expect(data.length).toBeGreaterThanOrEqual(3)
            expect(data.length).toBeLessThanOrEqual(5)
        })

        doit('Random.title()', (data) => {
            var words = data.split(' ')
            words.forEach(function(word: string) {
                expect(word[0]).toEqual(word[0].toUpperCase())
            })
            expect(words.length).toBeGreaterThanOrEqual(3)
            expect(words.length).toBeLessThanOrEqual(7)
        })
        doit('Random.title(4)', (data) => {
            var words = data.split(' ')
            words.forEach(function(word: string) {
                expect(word[0]).toEqual(word[0].toUpperCase())
            })
            expect(words).toHaveLength(4)
        })
        doit('Random.title(3, 5)', (data) => {
            var words = data.split(' ')
            words.forEach(function(word: string) {
                expect(word[0]).toEqual(word[0].toUpperCase())
            })
            expect(words.length).toBeGreaterThanOrEqual(3)
            expect(words.length).toBeLessThanOrEqual(5)
        })
    })

    describe('Name', () => {
        doit('Random.first()', (data) => {
            expect(data[0]).toEqual(data[0].toUpperCase())
        })
        doit('Random.last()', (data) => {
            expect(data[0]).toEqual(data[0].toUpperCase())
        })
        doit('Random.name()', (data) => {
            var words = data.split(' ')
            expect(words).toHaveLength(2)
            expect(words[0][0]).toEqual(words[0][0].toUpperCase())
            expect(words[1][0]).toEqual(words[1][0].toUpperCase())
        })
        doit('Random.name(true)', (data) => {
            var words = data.split(' ')
            expect(words).toHaveLength(3)
            expect(words[0][0]).toEqual(words[0][0].toUpperCase())
            expect(words[1][0]).toEqual(words[1][0].toUpperCase())
            expect(words[2][0]).toEqual(words[2][0].toUpperCase())
        })

        doit('Random.cfirst()', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.clast()', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.cname()', (data) => {
            expect(data).toBeTruthy()
        })
    })

    var RE_URL = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
    var RE_IP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
    describe('Web', () => {
        doit('Random.url()', (data) => {
            expect(RE_URL.test(data)).toBe(true)
        })
        doit('Random.domain()', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.domain("com")', (data) => {
            expect(data).toContain('.com')
        })
        doit('Random.tld()', (data) => {
            expect(data).toBeTruthy()
        })

        doit('Random.email()', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.email("nuysoft.com")', (data) => {
            expect(data).toContain('@nuysoft.com')
        })
        doit('Random.ip()', (data) => {
            expect(RE_IP.test(data)).toBe(true)
        })
    })
    describe('Address', () => {
        doit('Random.region()', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.province()', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.city()', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.city(true)', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.county()', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.county(true)', (data) => {
            expect(data).toBeTruthy()
        })
        doit('Random.zip()', (data) => {
            expect(data).toBeTruthy()
        })
    })
    describe('Helpers', () => {
        doit('Random.capitalize()', (data) => {
            expect(data).toEqual('Undefined')
        })
        doit('Random.capitalize("hello")', (data) => {
            expect(data).toEqual('Hello')
        })

        doit('Random.upper()', (data) => {
            expect(data).toEqual('UNDEFINED')
        })
        doit('Random.upper("hello")', (data) => {
            expect(data).toEqual('HELLO')
        })

        doit('Random.lower()', (data) => {
            expect(data).toEqual('undefined')
        })
        doit('Random.lower("HELLO")', (data) => {
            expect(data).toEqual('hello')
        })

        doit('Random.pick()', (data) => {
            expect(data).toBeUndefined()
        })
        doit('Random.pick("a", "e", "i", "o", "u")', (data) => {
            expect(['a', 'e', 'i', 'o', 'u']).toContain(data)
        })
        doit('Random.pick(["a", "e", "i", "o", "u"])', (data) => {
            expect(['a', 'e', 'i', 'o', 'u']).toContain(data)
        })
        doit('Random.pick(["a", "e", "i", "o", "u"], 3)', (data) => {
            expect(data).toBeTypeOf('object')
            expect(data).toHaveLength(3)
        })
        doit('Random.pick(["a", "e", "i", "o", "u"], 1, 5)', (data) => {
            expect(data).toBeTypeOf('object')
            expect(data.length).toBeGreaterThanOrEqual(1)
            expect(data.length).toBeLessThanOrEqual(5)
        })

        doit('Random.shuffle()', (data) => {
            expect(data).toEqual([])
        })
        doit('Random.shuffle(["a", "e", "i", "o", "u"])', (data) => {
            expect(data.join('')).not.toEqual('aeiou')
            expect(data.sort().join('')).toEqual('aeiou')
        })
        doit('Random.shuffle(["a", "e", "i", "o", "u"], 3)', (data) => {
            expect(data).toBeTypeOf('object')
            expect(data).toHaveLength(3)
        })
        doit('Random.shuffle(["a", "e", "i", "o", "u"], 1, 5)', (data) => {
            expect(data).toBeTypeOf('object')
            expect(data.length).toBeGreaterThanOrEqual(1)
            expect(data.length).toBeLessThanOrEqual(5)
        })
    })

    var RE_GUID = /[a-fA-F0-9]{8}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{12}/
    describe('Miscellaneous', () => {
        doit('Random.guid()', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data).toHaveLength(36)
            expect(RE_GUID.test(data)).toBe(true)
        })
        doit('Random.id()', (data) => {
            expect(data).toBeTypeOf('string')
            expect(data).toHaveLength(18)
        })
    })
})
