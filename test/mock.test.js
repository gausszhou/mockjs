import { describe, it, expect } from 'vitest'
import Mock from '@/mock.js'

describe('Mock.js', function() {
    describe('Mock.mock()', function() {
        describe('String placeholder', function() {
            it('should generate email', function() {
                const result = Mock.mock('@EMAIL')
                expect(result).to.be.a('string')
                expect(result).to.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            })

            it('should generate name', function() {
                const result = Mock.mock('@NAME')
                expect(result).to.be.a('string')
                expect(result).to.include(' ')
            })

            it('should generate uuid', function() {
                const result = Mock.mock('@UUID')
                expect(result).to.be.a('string')
                expect(result).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
            })
        })

        describe('Object template', function() {
            it('should generate list with rules', function() {
                const template = {
                    'list|1-10': [{
                        'id|+1': 1,
                        'name': '@NAME',
                        'email': '@EMAIL'
                    }]
                }
                const result = Mock.mock(template)
                expect(result).to.have.property('list')
                expect(result.list).to.be.an('array')
                expect(result.list.length).to.be.within(1, 10)
                
                result.list.forEach((item, index) => {
                    expect(item).to.have.property('id', index + 1)
                    expect(item).to.have.property('name')
                    expect(item).to.have.property('email')
                    expect(item.email).to.match(/^[a-zA-Z0-9._%+-]+@[^\s@]+\.[^\s@]+$/)
                })
            })

            it('should generate nested object', function() {
                const template = {
                    'user': {
                        'profile': {
                            'name': '@NAME',
                            'age|18-60': 1
                        }
                    }
                }
                const result = Mock.mock(template)
                expect(result.user).to.be.an('object')
                expect(result.user.profile).to.be.an('object')
                expect(result.user.profile.name).to.be.a('string')
                expect(result.user.profile.age).to.be.a('number')
            })
        })

        describe('Function template', function() {
            it('should execute function template', function() {
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
    })

    describe('Mock.Random', function() {
        it('should generate boolean', function() {
            const result = Mock.Random.boolean()
            expect(result).to.be.a('boolean')
        })

        it('should generate natural number', function() {
            const result = Mock.Random.natural()
            expect(result).to.be.a('number')
            expect(result).to.be.at.least(0)
        })

        it('should generate integer', function() {
            const result = Mock.Random.integer()
            expect(result).to.be.a('number')
            expect(Number.isInteger(result)).to.be.true
        })

        it('should generate float', function() {
            const result = Mock.Random.float()
            expect(result).to.be.a('number')
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
        })

        it('should generate range', function() {
            const result = Mock.Random.range(1, 5)
            expect(result).to.be.an('array')
            expect(result).to.deep.equal([1, 2, 3, 4])
        })
    })

    describe('Mock.Date', function() {
        it('should generate date', function() {
            const result = Mock.Random.date()
            expect(result).to.be.a('string')
            expect(result).to.match(/^\d{4}-\d{2}-\d{2}$/)
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
        })

        it('should generate now', function() {
            const result = Mock.Random.now()
            expect(result).to.be.a('string')
        })
    })

    describe('Mock.Image', function() {
        it('should generate image url', function() {
            const result = Mock.Random.image()
            expect(result).to.be.a('string')
            expect(result).to.match(/^https?:\/\/[^\/]+\/\d+x\d+\/[a-f0-9]{6}\/[a-f0-9]{6}$|^http:\/\/dummyimage\.com\/\d+x\d+$/)
        })
    })

    describe('Mock.Color', function() {
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

    describe('Mock.Text', function() {
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

    describe('Mock.Name', function() {
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

    describe('Mock.Web', function() {
        it('should generate url', function() {
            const result = Mock.Random.url()
            expect(result).to.be.a('string')
            expect(result).to.include('://')
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

    describe('Mock.Address', function() {
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

    describe('Mock.Helper', function() {
        it('should capitalize string', function() {
            const result = Mock.Random.capitalize('hello')
            expect(result).to.equal('Hello')
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

    describe('Mock.Miscellaneous', function() {
        it('should generate guid', function() {
            const result = Mock.Random.guid()
            expect(result).to.be.a('string')
            expect(result).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        })

        it('should generate id', function() {
            const result = Mock.Random.id()
            expect(result).to.be.a('string')
            expect(result.length).to.be.at.least(1)
        })

        it('should generate increment id', function() {
            const result1 = Mock.Random.increment()
            const result2 = Mock.Random.increment()
            expect(result1).to.be.a('number')
            expect(result2).to.be.a('number')
            expect(result2).to.equal(result1 + 1)
        })
    })

    describe('Mock.toJSONSchema()', function() {
        it('should convert template to JSON schema', function() {
            const template = { name: '@NAME', age: 18 }
            const schema = Mock.toJSONSchema(template)
            expect(schema).to.be.an('object')
            expect(schema).to.have.property('type', 'object')
        })
    })

    describe('Mock.valid()', function() {
        it('should validate data against template', function() {
            const template = { name: '@NAME' }
            const data = { name: 'John' }
            const result = Mock.valid(template, data)
            expect(result).to.be.an('array')
        })

        it('should return validation errors', function() {
            const template = { name: '@NAME' }
            const data = { age: 18 }
            const result = Mock.valid(template, data)
            expect(result).to.be.an('array')
            expect(result.length).to.be.at.least(1)
        })
    })

    describe('Mock.setup()', function() {
        it('should have setup method', function() {
            expect(Mock.setup).to.be.a('function')
        })
    })

    describe('Mock.XHR', function() {
        it('should have XHR property', function() {
            expect(Mock).to.have.property('XHR')
        })
    })
})
