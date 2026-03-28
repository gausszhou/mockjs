import { describe, it, expect, before } from 'vitest'
import Mock from '../src/mock.js'

describe('DPD', function() {
    describe('Reference', function() {
        it('@EMAIL', function() {
            var data = Mock.mock(this.test.title)
            expect(data).to.not.equal(this.test.title)
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
        it('escapes @EMAIL', function() {
            var data = Mock.mock('\\@EMAIL')
            expect(data).to.equal('@EMAIL')
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
