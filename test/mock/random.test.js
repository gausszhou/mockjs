import { describe, it, expect } from 'vitest'
import Mock from '@/mock.js'

const { Random } = Mock

describe('Random', function() {
    describe('Basic', function() {
        it('should generate boolean', function() {
            const result = Random.boolean()
            expect(result).to.be.a('boolean')
        })

        it('should generate natural number', function() {
            const result = Random.natural()
            expect(result).to.be.a('number')
            expect(result).to.be.at.least(0)
        })

        it('should generate natural number within range', function() {
            const result = Random.natural(1, 10)
            expect(result).to.be.a('number')
            expect(result).to.be.within(1, 10)
        })

        it('Random.natural(1, 3)', function() {
            expect(Random.natural(1, 3)).to.be.a('number').within(1, 3)
        })
        it('Random.natural(1)', function() {
            expect(Random.natural(1)).to.be.a('number').least(1)
        })

        it('should generate integer', function() {
            const result = Random.integer()
            expect(result).to.be.a('number')
            expect(Number.isInteger(result)).to.be.true
        })

        it('Random.integer(-10, 10)', function() {
            expect(Random.integer(-10, 10)).to.be.a('number').within(-10, 10)
        })

        var RE_FLOAT = /(\-?\d+)\.?(\d+)?/

        function validFloat(float, min, max, dmin, dmax) {
            RE_FLOAT.lastIndex = 0
            var parts = RE_FLOAT.exec(float + '')

            expect(+parts[1]).to.be.a('number').within(min, max)

            if (parts[2] != undefined) {
                expect(parts[2]).to.have.length.within(dmin, dmax)
            }
        }

        it('should generate float', function() {
            const result = Random.float()
            expect(result).to.be.a('number')
            expect(result.toString()).to.match(/^-?\d+(\.\d+)?$/)
        })

        it('Random.float(0)', function() {
            validFloat(Random.float(0), 0, 9007199254740992, 0, 17)
        })
        it('Random.float(60, 100)', function() {
            validFloat(Random.float(60, 100), 60, 100, 0, 17)
        })
        it('Random.float(60, 100, 3)', function() {
            validFloat(Random.float(60, 100, 3), 60, 100, 3, 17)
        })
        it('Random.float(60, 100, 3, 5)', function() {
            validFloat(Random.float(60, 100, 3, 5), 60, 100, 3, 5)
        })

        var CHARACTER_LOWER = 'abcdefghijklmnopqrstuvwxyz'
        var CHARACTER_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var CHARACTER_NUMBER = '0123456789'
        var CHARACTER_SYMBOL = '!@#$%^&*()[]'

        it('should generate character', function() {
            const result = Random.character()
            expect(result).to.be.a('string')
            expect(result.length).to.equal(1)
        })

        it('Random.character("lower")', function() {
            var data = Random.character("lower")
            expect(data).to.be.a('string').with.length(1)
            expect(CHARACTER_LOWER).to.include(data)
        })
        it('Random.character("upper")', function() {
            var data = Random.character("upper")
            expect(data).to.be.a('string').with.length(1)
            expect(CHARACTER_UPPER).to.include(data)
        })
        it('Random.character("number")', function() {
            var data = Random.character("number")
            expect(data).to.be.a('string').with.length(1)
            expect(CHARACTER_NUMBER).to.include(data)
        })
        it('Random.character("symbol")', function() {
            var data = Random.character("symbol")
            expect(data).to.be.a('string').with.length(1)
            expect(CHARACTER_SYMBOL).to.include(data)
        })
        it('Random.character("aeiou")', function() {
            var data = Random.character("aeiou")
            expect(data).to.be.a('string').with.length(1)
            expect('aeiou').to.include(data)
        })

        it('should generate string', function() {
            const result = Random.string()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(3)
            expect(result.length).to.be.at.most(7)
        })

        it('should generate string with length', function() {
            const result = Random.string(5)
            expect(result).to.be.a('string')
            expect(result.length).to.equal(5)
        })

        it('should generate string with pool', function() {
            const result = Random.string('abc', 3)
            expect(result).to.be.a('string')
            expect(result.length).to.equal(3)
            expect(result).to.match(/^[abc]{3}$/)
        })

        it('Random.string("lower", 5)', function() {
            var data = Random.string("lower", 5)
            expect(data).to.be.a('string').with.length(5)
            for (var i = 0; i < data.length; i++) {
                expect(CHARACTER_LOWER).to.include(data[i])
            }
        })
        it('Random.string(7, 10)', function() {
            expect(Random.string(7, 10)).to.be.a('string').with.length.within(7, 10)
        })
        it('Random.string("aeiou", 1, 3)', function() {
            var data = Random.string("aeiou", 1, 3)
            expect(data).to.be.a('string').with.length.within(1, 3)
            for (var i = 0; i < data.length; i++) {
                expect('aeiou').to.include(data[i])
            }
        })

        it('should generate range', function() {
            const result = Random.range(1, 5)
            expect(result).to.be.an('array')
            expect(result).to.deep.equal([1, 2, 3, 4])
        })

        it('Random.range(10)', function() {
            expect(Random.range(10)).to.be.an('array').with.length(10)
        })
        it('Random.range(3, 7)', function() {
            expect(Random.range(3, 7)).to.be.an('array').deep.equal([3, 4, 5, 6])
        })
        it('Random.range(1, 10, 2)', function() {
            expect(Random.range(1, 10, 2)).to.be.an('array').deep.equal([1, 3, 5, 7, 9])
        })
        it('Random.range(1, 10, 3)', function() {
            expect(Random.range(1, 10, 3)).to.be.an('array').deep.equal([1, 4, 7])
        })
    })

    describe('Date', function() {
        var RE_DATE = /\d{4}-\d{2}-\d{2}/
        var RE_TIME = /\d{2}:\d{2}:\d{2}/
        var RE_DATETIME = new RegExp(RE_DATE.source + ' ' + RE_TIME.source)

        it('should generate date', function() {
            const result = Random.date()
            expect(result).to.be.a('string')
            expect(RE_DATE.test(result)).to.be.true
        })

        it('should generate time', function() {
            const result = Random.time()
            expect(result).to.be.a('string')
            expect(RE_TIME.test(result)).to.be.true
        })

        it('should generate datetime', function() {
            const result = Random.datetime()
            expect(result).to.be.a('string')
            expect(RE_DATETIME.test(result)).to.be.true
        })

        it('Random.datetime("yyyy-MM-dd A HH:mm:ss")', function() {
            expect(Random.datetime("yyyy-MM-dd A HH:mm:ss")).to.be.ok
        })
        it('Random.datetime("yyyy-MM-dd a HH:mm:ss")', function() {
            expect(Random.datetime("yyyy-MM-dd a HH:mm:ss")).to.be.ok
        })
        it('Random.datetime("yy-MM-dd HH:mm:ss")', function() {
            expect(Random.datetime("yy-MM-dd HH:mm:ss")).to.be.ok
        })
        it('Random.datetime("y-MM-dd HH:mm:ss")', function() {
            expect(Random.datetime("y-MM-dd HH:mm:ss")).to.be.ok
        })
        it('Random.datetime("y-M-d H:m:s")', function() {
            expect(Random.datetime("y-M-d H:m:s")).to.be.ok
        })
        it('Random.datetime("yyyy yy y MM M dd d HH H hh h mm m ss s SS S A a T")', function() {
            expect(Random.datetime("yyyy yy y MM M dd d HH H hh h mm m ss s SS S A a T")).to.be.ok
        })

        it('Random.now()', function() {
            expect(Random.now()).to.be.ok
        })
        it('Random.now("year")', function() {
            expect(Random.now("year")).to.be.ok
        })
        it('Random.now("month")', function() {
            expect(Random.now("month")).to.be.ok
        })
        it('Random.now("day")', function() {
            expect(Random.now("day")).to.be.ok
        })
        it('Random.now("hour")', function() {
            expect(Random.now("hour")).to.be.ok
        })
        it('Random.now("minute")', function() {
            expect(Random.now("minute")).to.be.ok
        })
        it('Random.now("second")', function() {
            expect(Random.now("second")).to.be.ok
        })
        it('Random.now("week")', function() {
            expect(Random.now("week")).to.be.ok
        })
        it('Random.now("yyyy-MM-dd HH:mm:ss SS")', function() {
            expect(Random.now("yyyy-MM-dd HH:mm:ss SS")).to.be.ok
        })
    })

    describe('Image', function() {
        it('should generate image url', function() {
            const result = Random.image()
            expect(result).to.be.a('string')
            expect(result).to.match(/^https?:\/\/[^\/]+\/\d+x\d+\/[a-f0-9]{6}\/[a-f0-9]{6}$|^http:\/\/dummyimage\.com\/\d+x\d+$/)
        })

        it('should generate image url with size', function() {
            const result = Random.image('200x100')
            expect(result).to.be.a('string')
            expect(result).to.match(/^https?:\/\/[^\/]+\/200x100\/[a-f0-9]{6}\/[a-f0-9]{6}$|^http:\/\/dummyimage\.com\/200x100$/)
        })


    })

    var RE_COLOR = /^#[0-9a-fA-F]{6}$/
    var RE_COLOR_RGB = /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/
    var RE_COLOR_RGBA = /^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, 0\.\d{1,2}\)$/
    var RE_COLOR_HSL = /^hsl\(\d{1,3}, \d{1,3}, \d{1,3}\)$/

    describe('Color', function() {
        it('should generate color', function() {
            const result = Random.color()
            expect(result).to.be.a('string')
            expect(result).to.match(/^#[0-9a-fA-F]{6}$/)
        })

        it('should generate hex color', function() {
            const result = Random.hex()
            expect(result).to.be.a('string')
            expect(result).to.match(/^#[0-9a-fA-F]{6}$/)
        })

        it('should generate rgb color', function() {
            const result = Random.rgb()
            expect(result).to.be.a('string')
            expect(result).to.match(/^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/)
        })

        it('should generate rgba color', function() {
            const result = Random.rgba()
            expect(result).to.be.a('string')
            expect(result).to.match(/^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(?:0(?:\.\d+)?|1(?:\.0+)?)\)$/)
        })

        it('should generate hsl color', function() {
            const result = Random.hsl()
            expect(result).to.be.a('string')
            expect(result).to.match(/^hsl\(\d{1,3},\s*\d{1,3}(?:%?),\s*\d{1,3}(?:%?)\)$/)
        })

        it('Random.color()', function() {
            expect(RE_COLOR.test(Random.color())).to.be.true
        })
        it('Random.hex()', function() {
            expect(RE_COLOR.test(Random.hex())).to.be.true
        })
        it('Random.rgb()', function() {
            expect(RE_COLOR_RGB.test(Random.rgb())).to.be.true
        })
        it('Random.rgba()', function() {
            expect(RE_COLOR_RGBA.test(Random.rgba())).to.be.true
        })
        it('Random.hsl()', function() {
            expect(RE_COLOR_HSL.test(Random.hsl())).to.be.true
        })
    })

    describe('Text', function() {
        it('should generate paragraph', function() {
            const result = Random.paragraph()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate sentence', function() {
            const result = Random.sentence()
            expect(result).to.be.a('string')
            expect(result).to.match(/^[A-Z][^.!?]*[.!?]$/)
        })

        it('should generate word', function() {
            const result = Random.word()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate title', function() {
            const result = Random.title()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('Random.paragraph(2)', function() {
            expect(Random.paragraph(2).split('.').length - 1).to.equal(2)
        })
        it('Random.paragraph(1, 3)', function() {
            expect(Random.paragraph(1, 3).split('.').length - 1).to.within(1, 3)
        })

        it('Random.sentence(4)', function() {
            var data = Random.sentence(4)
            expect(data[0]).to.equal(data.toUpperCase()[0])
            expect(data.split(' ').length).to.equal(4)
        })
        it('Random.sentence(3, 5)', function() {
            var data = Random.sentence(3, 5)
            expect(data[0]).to.equal(data.toUpperCase()[0])
            expect(data.split(' ').length).to.within(3, 5)
        })

        it('Random.word(4)', function() {
            expect(Random.word(4)).to.have.length(4)
        })
        it('Random.word(3, 5)', function() {
            expect(Random.word(3, 5)).to.have.length.within(3, 5)
        })

        it('Random.title(4)', function() {
            var data = Random.title(4)
            var words = data.split(' ')
            words.forEach(function(word) {
                expect(word[0]).to.equal(word[0].toUpperCase())
            })
            expect(words).to.have.length(4)
        })
        it('Random.title(3, 5)', function() {
            var data = Random.title(3, 5)
            var words = data.split(' ')
            words.forEach(function(word) {
                expect(word[0]).to.equal(word[0].toUpperCase())
            })
            expect(words).to.have.length.within(3, 5)
        })
    })

    describe('Name', function() {
        it('should generate first name', function() {
            const result = Random.first()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate last name', function() {
            const result = Random.last()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate full name', function() {
            const result = Random.name()
            expect(result).to.be.a('string')
            expect(result).to.include(' ')
            expect(result.split(' ').length).to.be.at.least(2)
        })

        it('Random.first()', function() {
            var data = Random.first()
            expect(data[0]).to.equal(data[0].toUpperCase())
        })
        it('Random.last()', function() {
            var data = Random.last()
            expect(data[0]).to.equal(data[0].toUpperCase())
        })
        it('Random.name()', function() {
            var data = Random.name()
            var words = data.split(' ')
            expect(words).to.have.length(2)
            expect(words[0][0]).to.equal(words[0][0].toUpperCase())
            expect(words[1][0]).to.equal(words[1][0].toUpperCase())
        })
        it('Random.name(true)', function() {
            var data = Random.name(true)
            var words = data.split(' ')
            expect(words).to.have.length(3)
            expect(words[0][0]).to.equal(words[0][0].toUpperCase())
            expect(words[1][0]).to.equal(words[1][0].toUpperCase())
            expect(words[2][0]).to.equal(words[2][0].toUpperCase())
        })

        it('Random.cfirst()', function() {
            expect(Random.cfirst()).to.be.ok
        })
        it('Random.clast()', function() {
            expect(Random.clast()).to.be.ok
        })
        it('Random.cname()', function() {
            expect(Random.cname()).to.be.ok
        })
    })

    var RE_URL = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
    var RE_IP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/

    describe('Web', function() {
        it('should generate url', function() {
            const result = Random.url()
            expect(result).to.be.a('string')
            expect(result).to.include('://')
        })

        it('should generate domain', function() {
            const result = Random.domain()
            expect(result).to.be.a('string')
            expect(result).to.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)
        })

        it('should generate email', function() {
            const result = Random.email()
            expect(result).to.be.a('string')
            expect(result).to.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        })

        it('should generate ip', function() {
            const result = Random.ip()
            expect(result).to.be.a('string')
            expect(result).to.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
        })

        it('Random.url()', function() {
            expect(RE_URL.test(Random.url())).to.be.ok
        })
        it('Random.domain()', function() {
            expect(Random.domain()).to.be.ok
        })
        it('Random.domain("com")', function() {
            expect(Random.domain("com")).to.include('.com')
        })
        it('Random.tld()', function() {
            expect(Random.tld()).to.be.ok
        })

        it('Random.email()', function() {
            expect(Random.email()).to.be.ok
        })
        it('Random.email("nuysoft.com")', function() {
            expect(Random.email("nuysoft.com")).to.include('@nuysoft.com')
        })
        it('Random.ip()', function() {
            expect(RE_IP.test(Random.ip())).to.be.ok
        })
    })

    describe('Address', function() {
        it('should generate region', function() {
            const result = Random.region()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate province', function() {
            const result = Random.province()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate city', function() {
            const result = Random.city()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate county', function() {
            const result = Random.county()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate zip', function() {
            const result = Random.zip()
            expect(result).to.be.a('string')
            expect(result).to.match(/^\d{6}$/)
        })

        it('Random.region()', function() {
            expect(Random.region()).to.be.ok
        })
        it('Random.province()', function() {
            expect(Random.province()).to.be.ok
        })
        it('Random.city()', function() {
            expect(Random.city()).to.be.ok
        })
        it('Random.city(true)', function() {
            expect(Random.city(true)).to.be.ok
        })
        it('Random.county()', function() {
            expect(Random.county()).to.be.ok
        })
        it('Random.county(true)', function() {
            expect(Random.county(true)).to.be.ok
        })
        it('Random.zip()', function() {
            expect(Random.zip()).to.be.ok
        })
    })

    describe('Helpers', function() {
        it('should capitalize string', function() {
            const result = Random.capitalize('hello')
            expect(result).to.equal('Hello')
        })

        it('should capitalize first letter', function() {
            const result = Random.capitalize('hello world')
            expect(result).to.equal('Hello world')
        })

        it('should upper string', function() {
            const result = Random.upper('hello')
            expect(result).to.equal('HELLO')
        })

        it('should lower string', function() {
            const result = Random.lower('HELLO')
            expect(result).to.equal('hello')
        })

        it('should pick array element', function() {
            const arr = [1, 2, 3, 4, 5]
            const result = Random.pick(arr)
            expect(arr).to.include(result)
        })

        it('should shuffle array', function() {
            const arr = [1, 2, 3, 4, 5]
            const result = Random.shuffle(arr.slice())
            expect(result).to.have.members(arr)
            expect(result).to.not.deep.equal(arr)
        })

        it('Random.capitalize()', function() {
            expect(Random.capitalize()).to.equal('Undefined')
        })
        it('Random.capitalize("hello")', function() {
            expect(Random.capitalize("hello")).to.equal('Hello')
        })

        it('Random.upper()', function() {
            expect(Random.upper()).to.equal('UNDEFINED')
        })
        it('Random.upper("hello")', function() {
            expect(Random.upper("hello")).to.equal('HELLO')
        })

        it('Random.lower()', function() {
            expect(Random.lower()).to.equal('undefined')
        })
        it('Random.lower("HELLO")', function() {
            expect(Random.lower("HELLO")).to.equal('hello')
        })

        it('Random.pick()', function() {
            expect(Random.pick()).to.be.undefined
        })
        it('Random.pick("a", "e", "i", "o", "u")', function() {
            expect(["a", "e", "i", "o", "u"]).to.include(Random.pick("a", "e", "i", "o", "u"))
        })
        it('Random.pick(["a", "e", "i", "o", "u"])', function() {
            expect(["a", "e", "i", "o", "u"]).to.include(Random.pick(["a", "e", "i", "o", "u"]))
        })
        it('Random.pick(["a", "e", "i", "o", "u"], 3)', function() {
            expect(Random.pick(["a", "e", "i", "o", "u"], 3)).to.be.an('array').with.length(3)
        })
        it('Random.pick(["a", "e", "i", "o", "u"], 1, 5)', function() {
            expect(Random.pick(["a", "e", "i", "o", "u"], 1, 5)).to.be.an('array').with.length.within(1, 5)
        })

        it('Random.shuffle()', function() {
            expect(Random.shuffle()).to.deep.equal([])
        })
        it('Random.shuffle(["a", "e", "i", "o", "u"])', function() {
            var data = Random.shuffle(["a", "e", "i", "o", "u"])
            expect(data.join('')).to.not.equal('aeiou')
            expect(data.sort().join('')).to.equal('aeiou')
        })
        it('Random.shuffle(["a", "e", "i", "o", "u"], 3)', function() {
            expect(Random.shuffle(["a", "e", "i", "o", "u"], 3)).to.be.an('array').with.length(3)
        })
        it('Random.shuffle(["a", "e", "i", "o", "u"], 1, 5)', function() {
            expect(Random.shuffle(["a", "e", "i", "o", "u"], 1, 5)).to.be.an('array').with.length.within(1, 5)
        })
    })

    var RE_GUID = /[a-fA-F0-9]{8}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{4}\-[a-fA-F0-9]{12}/

    describe('Miscellaneous', function() {
        it('should generate guid', function() {
            const result = Random.guid()
            expect(result).to.be.a('string')
            expect(result).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        })

        it('should generate id', function() {
            const result = Random.id()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate increment id', function() {
            const result1 = Random.increment()
            const result2 = Random.increment()
            expect(result1).to.be.a('number')
            expect(result2).to.be.a('number')
            expect(result2).to.equal(result1 + 1)
        })

        it('Random.guid()', function() {
            var data = Random.guid()
            expect(data).to.be.a('string').with.length(36)
            expect(RE_GUID.test(data)).to.be.true
        })
        it('Random.id()', function() {
            expect(Random.id()).to.be.a('string').with.length(18)
        })
    })
})
