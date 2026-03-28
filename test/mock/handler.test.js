import { describe, it, expect } from 'vitest'
import Mock from '../../src/mock.js'

describe('Mock.handler', function() {
    describe('Mock.mock( String )', function() {
        it('generates email from placeholder', function() {
            var data = Mock.mock('@EMAIL')
            expect(data).to.not.equal('@EMAIL')
        })

        it('should mock simple string template', function() {
            const result = Mock.mock('@EMAIL')
            expect(result).to.be.a('string')
            expect(result).to.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        })
    })

    describe('Mock.mock( {} )', function() {
        it('generates list with template', function() {
            var tpl = {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL'
                }]
            }
            var data = Mock.mock(tpl)
            expect(data).to.have.property('list')
                .that.be.an('array').with.length.within(1, 10)
            data.list.forEach(function(item, index, list) {
                if (index > 0) expect(item.id).to.equal(list[index - 1].id + 1)
            })
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
    })

    describe('Mock.mock( function() )', function() {
        it('generates data with function', function() {
            var fn = function() {
                return Mock.mock({
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                })
            }
            var data = Mock.mock(fn)
            expect(data).to.have.property('list')
                .that.be.an('array').with.length.within(1, 10)
            data.list.forEach(function(item, index, list) {
                if (index > 0) expect(item.id).to.equal(list[index - 1].id + 1)
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

    describe('DTD - Data Type Definition', function() {
        describe('Literal', function() {
            it('returns literal value', function() {
                var data = Mock.mock('foo')
                expect(data).to.equal('foo')
            })
            it('returns number literal', function() {
                var data = Mock.mock(1)
                expect(data).to.equal(1)
            })
            it('returns boolean literal', function() {
                var data = Mock.mock(true)
                expect(data).to.equal(true)
            })
            it('returns object literal', function() {
                var data = Mock.mock({ a: 1 })
                expect(data).to.deep.equal({ a: 1 })
            })
            it('returns array literal', function() {
                var data = Mock.mock([1, 2, 3])
                expect(data).to.deep.equal([1, 2, 3])
            })
        })
        describe('String', function() {
            it('generates string with min-max rule', function() {
                var data = Mock.mock({
                    'name|1-10': '★'
                })
                expect(data.name).to.be.a('string')
                expect(data.name.length).to.be.within(1, 10)
            })
            it('generates string with count rule', function() {
                var data = Mock.mock({
                    'name|5': '★'
                })
                expect(data.name).to.equal('★★★★★')
            })
        })
        describe('Number', function() {
            it('generates integer with range', function() {
                var data = Mock.mock({
                    'age|18-60': 1
                })
                expect(data.age).to.be.a('number')
                expect(data.age).to.be.within(18, 60)
            })
            it('generates integer with step', function() {
                var data = Mock.mock({
                    'id|+1': 1
                })
                expect(data.id).to.be.a('number')
            })
        })
        describe('Boolean', function() {
            it('generates boolean', function() {
                var data = Mock.mock({
                    'flag': true
                })
                expect(data.flag).to.be.a('boolean')
            })
        })
        describe('Array', function() {
            it('generates array with items', function() {
                var data = Mock.mock({
                    'list': [1, 2, 3]
                })
                expect(data.list).to.be.an('array')
            })
            it('generates array with count', function() {
                var data = Mock.mock({
                    'list|3': [{ 'id': 1 }]
                })
                expect(data.list).to.have.length(3)
            })
            it('generates array with range', function() {
                var data = Mock.mock({
                    'list|1-3': [{
                        'id': 1
                    }]
                })
                expect(data.list.length).to.be.within(1, 3)
            })
        })
        describe('Object', function() {
            it('generates object', function() {
                var data = Mock.mock({
                    'user': { name: 'Tom' }
                })
                expect(data.user).to.be.an('object')
            })
            it('generates object with count', function() {
                var data = Mock.mock({
                    'users|3': [{ name: 'Tom' }]
                })
                expect(data.users).to.have.length(3)
            })
        })
        describe('Function', function() {
            it('calls function template', function() {
                var data = Mock.mock(function() {
                    return { name: 'Tom' }
                })
                expect(data).to.have.property('name', 'Tom')
            })
        })
        describe('RegExp', function() {
            it('generates regexp', function() {
                var data = Mock.mock({
                    'email': /[a-z]+@[a-z]+\.[a-z]+/
                })
                expect(data.email).to.be.a('string')
            })
        })
    })

    describe('DPD - Data Placeholder', function() {
        describe('Reference', function() {
            it('@EMAIL', function() {
                var data = Mock.mock('@EMAIL')
                expect(data).to.not.equal('@EMAIL')
            })
        })
        describe('Priority', function() {
            it('@EMAIL priority', function() {
                var data = Mock.mock({
                    email: 'nuysoft@gmail.com',
                    name: '@EMAIL'
                })
                expect(data.name).to.not.equal(data.email)
            })
            it('@email case sensitive', function() {
                var data = Mock.mock({
                    email: 'nuysoft@gmail.com',
                    name: '@email'
                })
                expect(data.name).to.equal(data.email)
            })
        })
        describe('Escape', function() {
            it('double @ generates placeholder', function() {
                var data = Mock.mock('@@EMAIL')
                expect(data).to.not.equal('@EMAIL')
            })
        })
        describe('Path', function() {
            it('Absolute Path', function() {
                var data = Mock.mock({
                    id: '@UUID',
                    children: [{
                        parentId: '@/id'
                    }],
                    child: {
                        parentId: '@/id'
                    }
                })
                expect(data.children[0]).to.have.property('parentId', data.id)
                expect(data.child).to.have.property('parentId', data.id)
            })
            it('Relative Path', function() {
                var data = Mock.mock({
                    id: '@UUID',
                    children: [{
                        parentId: '@../../id'
                    }],
                    child: {
                        parentId: '@../id'
                    }
                })
                expect(data.children[0]).to.have.property('parentId', data.id)
                expect(data.child).to.have.property('parentId', data.id)
            })
        })
        describe('Basic Types', function() {
            it('generates boolean', function() {
                var data = Mock.mock('@BOOLEAN')
                expect(data).to.be.a('boolean')
            })
            it('generates natural', function() {
                var data = Mock.mock('@NATURAL')
                expect(data).to.be.a('number')
                expect(data).to.be.at.least(0)
            })
            it('generates integer', function() {
                var data = Mock.mock('@INTEGER')
                expect(data).to.be.a('number')
            })
            it('generates float', function() {
                var data = Mock.mock('@FLOAT')
                expect(data).to.be.a('number')
            })
        })
        describe('Name', function() {
            it('generates first name', function() {
                var data = Mock.mock('@FIRST')
                expect(data).to.be.a('string')
            })
            it('generates last name', function() {
                var data = Mock.mock('@LAST')
                expect(data).to.be.a('string')
            })
            it('generates full name', function() {
                var data = Mock.mock('@NAME')
                expect(data).to.be.a('string')
                expect(data).to.include(' ')
            })
        })
        describe('Web', function() {
            it('generates email', function() {
                var data = Mock.mock('@EMAIL')
                expect(data).to.be.a('string')
                expect(data).to.include('@')
            })
            it('generates url', function() {
                var data = Mock.mock('@URL')
                expect(data).to.be.a('string')
                expect(data).to.include('://')
            })
            it('generates ip', function() {
                var data = Mock.mock('@IP')
                expect(data).to.be.a('string')
                expect(data).to.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
            })
        })
    })

    describe('Mock.mock() with rurl', function() {
        it('registers mock with rurl', function() {
            var template = { name: '@NAME' }
            var mock = Mock.mock('/api/user', template)
            expect(mock).to.have.property('_mocked')
            expect(mock._mocked['/api/user']).to.deep.equal({
                rurl: '/api/user',
                rtype: undefined,
                template: template
            })
        })
        it('registers mock with rurl and rtype', function() {
            var template = { name: '@NAME' }
            var mock = Mock.mock('/api/user', 'GET', template)
            expect(mock._mocked['/api/userGET']).to.deep.equal({
                rurl: '/api/user',
                rtype: 'GET',
                template: template
            })
        })
    })
})
