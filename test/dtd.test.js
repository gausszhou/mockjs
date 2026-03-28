import { describe, it, expect, before } from 'vitest'
import Mock from '../src/mock.js'

describe('DTD', function() {
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
                'list|3': [1, 2, 3]
            })
            expect(data.list).to.have.length(3)
        })
        it('generates array with range', function() {
            var data = Mock.mock({
                'list|1-3': [1, 2, 3]
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
