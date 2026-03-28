import { describe, it, expect } from 'vitest'
import Mock from '../src/mock.js'

describe('Mock.js - Node.js Tests', function() {
    describe('Basic Mock.mock()', function() {
        it('should mock simple string template', function() {
            const result = Mock.mock('@EMAIL')
            expect(result).to.be.a('string')
            expect(result).to.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        })

        it('should mock object template', function() {
            const template = {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL'
                }]
            }
            const result = Mock.mock(template)
            expect(result).to.have.property('list')
            expect(result.list).to.be.an('array')
            expect(result.list.length).to.be.within(1, 10)
            
            result.list.forEach((item, index) => {
                expect(item).to.have.property('id', index + 1)
                expect(item).to.have.property('email')
                expect(item.email).to.be.a('string')
                expect(item.email).to.match(/^[a-zA-Z0-9._%+-]+@[^\s@]+\.[^\s@]+$/)
            })
        })

        it('should mock with function template', function() {
            const template = function() {
                return Mock.mock({
                    'name': '@NAME',
                    'age|18-60': 1
                })
            }
            const result = Mock.mock(template)
            expect(result).to.have.property('name')
            expect(result).to.have.property('age')
            expect(result.age).to.be.a('number')
            expect(result.age).to.be.within(18, 60)
        })
    })

    describe('Random module', function() {
        it('should generate boolean', function() {
            const result = Mock.Random.boolean()
            expect(result).to.be.a('boolean')
        })

        it('should generate natural number', function() {
            const result = Mock.Random.natural()
            expect(result).to.be.a('number')
            expect(result).to.be.at.least(0)
        })

        it('should generate natural number within range', function() {
            const result = Mock.Random.natural(1, 10)
            expect(result).to.be.a('number')
            expect(result).to.be.within(1, 10)
        })

        it('should generate integer', function() {
            const result = Mock.Random.integer()
            expect(result).to.be.a('number')
            expect(Number.isInteger(result)).to.be.true
        })

        it('should generate float', function() {
            const result = Mock.Random.float()
            expect(result).to.be.a('number')
            expect(result.toString()).to.match(/^-?\d+(\.\d+)?$/)
        })

        it('should generate character', function() {
            const result = Mock.Random.character()
            expect(result).to.be.a('string')
            expect(result.length).to.equal(1)
        })

        it('should generate string', function() {
            const result = Mock.Random.string()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(3)
            expect(result.length).to.be.at.most(7)
        })

        it('should generate string with length', function() {
            const result = Mock.Random.string(5)
            expect(result).to.be.a('string')
            expect(result.length).to.equal(5)
        })

        it('should generate string with pool', function() {
            const result = Mock.Random.string('abc', 3)
            expect(result).to.be.a('string')
            expect(result.length).to.equal(3)
            expect(result).to.match(/^[abc]{3}$/)
        })

        it('should generate range', function() {
            const result = Mock.Random.range(1, 5)
            expect(result).to.be.an('array')
            expect(result).to.deep.equal([1, 2, 3, 4])
        })
    })

    describe('Date module', function() {
        it('should generate date', function() {
            const result = Mock.Random.date()
            expect(result).to.be.a('string')
            expect(new Date(result)).to.be.a('date')
            expect(new Date(result).toString()).to.not.equal('Invalid Date')
        })

        it('should generate time', function() {
            const result = Mock.Random.time()
            expect(result).to.be.a('string')
            expect(result).to.match(/^\d{2}:\d{2}:\d{2}$/)
        })

        it('should generate datetime', function() {
            const result = Mock.Random.datetime()
            expect(result).to.be.a('string')
            expect(new Date(result)).to.be.a('date')
            expect(new Date(result).toString()).to.not.equal('Invalid Date')
        })
    })

    describe('Image module', function() {
        it('should generate image url', function() {
            const result = Mock.Random.image()
            expect(result).to.be.a('string')
            expect(result).to.match(/^https?:\/\/[^\/]+\/\d+x\d+\/[a-f0-9]{6}\/[a-f0-9]{6}$|^http:\/\/dummyimage\.com\/\d+x\d+$/)
        })

        it('should generate image url with size', function() {
            const result = Mock.Random.image('200x100')
            expect(result).to.be.a('string')
            expect(result).to.match(/^https?:\/\/[^\/]+\/200x100\/[a-f0-9]{6}\/[a-f0-9]{6}$|^http:\/\/dummyimage\.com\/200x100$/)
        })
    })

    describe('Color module', function() {
        it('should generate color', function() {
            const result = Mock.Random.color()
            expect(result).to.be.a('string')
            expect(result).to.match(/^#[0-9a-fA-F]{6}$/)
        })

        it('should generate hex color', function() {
            const result = Mock.Random.hex()
            expect(result).to.be.a('string')
            expect(result).to.match(/^#[0-9a-fA-F]{6}$/)
        })

        it('should generate rgb color', function() {
            const result = Mock.Random.rgb()
            expect(result).to.be.a('string')
            expect(result).to.match(/^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/)
        })

        it('should generate rgba color', function() {
            const result = Mock.Random.rgba()
            expect(result).to.be.a('string')
            expect(result).to.match(/^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(?:0(?:\.\d+)?|1(?:\.0+)?)\)$/)
        })

        it('should generate hsl color', function() {
            const result = Mock.Random.hsl()
            expect(result).to.be.a('string')
            expect(result).to.match(/^hsl\(\d{1,3},\s*\d{1,3}(?:%?),\s*\d{1,3}(?:%?)\)$/)
        })
    })

    describe('Text module', function() {
        it('should generate paragraph', function() {
            const result = Mock.Random.paragraph()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate sentence', function() {
            const result = Mock.Random.sentence()
            expect(result).to.be.a('string')
            expect(result).to.match(/^[A-Z][^.!?]*[.!?]$/)
        })

        it('should generate word', function() {
            const result = Mock.Random.word()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate title', function() {
            const result = Mock.Random.title()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })
    })

    describe('Name module', function() {
        it('should generate first name', function() {
            const result = Mock.Random.first()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate last name', function() {
            const result = Mock.Random.last()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate full name', function() {
            const result = Mock.Random.name()
            expect(result).to.be.a('string')
            expect(result).to.include(' ')
            expect(result.split(' ').length).to.be.at.least(2)
        })
    })

    describe('Web module', function() {
        it('should generate url', function() {
            const result = Mock.Random.url()
            expect(result).to.be.a('string')
            expect(result).to.match(/^[a-z]+:\/\/[^\/]+\.[^\/]+/)
        })

        it('should generate domain', function() {
            const result = Mock.Random.domain()
            expect(result).to.be.a('string')
            expect(result).to.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)
        })

        it('should generate email', function() {
            const result = Mock.Random.email()
            expect(result).to.be.a('string')
            expect(result).to.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        })

        it('should generate ip', function() {
            const result = Mock.Random.ip()
            expect(result).to.be.a('string')
            expect(result).to.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
        })
    })

    describe('Address module', function() {
        it('should generate region', function() {
            const result = Mock.Random.region()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate province', function() {
            const result = Mock.Random.province()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate city', function() {
            const result = Mock.Random.city()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate county', function() {
            const result = Mock.Random.county()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate zip', function() {
            const result = Mock.Random.zip()
            expect(result).to.be.a('string')
            expect(result).to.match(/^\d{6}$/)
        })
    })

    describe('Helper module', function() {
        it('should capitalize string', function() {
            const result = Mock.Random.capitalize('hello')
            expect(result).to.equal('Hello')
        })

        it('should capitalize first letter', function() {
            const result = Mock.Random.capitalize('hello world')
            expect(result).to.equal('Hello world')
        })

        it('should upper string', function() {
            const result = Mock.Random.upper('hello')
            expect(result).to.equal('HELLO')
        })

        it('should lower string', function() {
            const result = Mock.Random.lower('HELLO')
            expect(result).to.equal('hello')
        })

        it('should pick array element', function() {
            const arr = [1, 2, 3, 4, 5]
            const result = Mock.Random.pick(arr)
            expect(arr).to.include(result)
        })

        it('should shuffle array', function() {
            const arr = [1, 2, 3, 4, 5]
            const result = Mock.Random.shuffle(arr.slice())
            expect(result).to.have.members(arr)
            expect(result).to.not.deep.equal(arr)
        })
    })

    describe('Misc module', function() {
        it('should generate guid', function() {
            const result = Mock.Random.guid()
            expect(result).to.be.a('string')
            expect(result).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        })

        it('should generate id', function() {
            const result = Mock.Random.id()
            expect(result).to.be.a('string')
            expect(result).to.match(/^\d{18}$/)
        })

        it('should generate increment id', function() {
            const result1 = Mock.Random.increment()
            const result2 = Mock.Random.increment()
            expect(result1).to.be.a('number')
            expect(result2).to.be.a('number')
            expect(result2).to.equal(result1 + 1)
        })
    })
})
