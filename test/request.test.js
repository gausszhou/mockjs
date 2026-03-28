import { describe, it, expect } from 'vitest'
import Mock from '../src/mock.js'

describe('Request', function() {
    describe('Mock.setup()', function() {
        it('should have setup method', function() {
            expect(Mock.setup).to.be.a('function')
        })
        it('should accept timeout setting', function() {
            var result = Mock.setup({
                timeout: 5000
            })
            expect(result).to.be.an('object')
        })
    })
    describe('Mock.XHR', function() {
        it('should have XHR property', function() {
            expect(Mock).to.have.property('XHR')
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
    describe('Mock.toJSONSchema()', function() {
        it('converts template to JSON schema', function() {
            var template = { name: '@NAME' }
            var schema = Mock.toJSONSchema(template)
            expect(schema).to.be.an('object')
            expect(schema).to.have.property('type', 'object')
        })
    })
    describe('Mock.valid()', function() {
        it('validates data against template', function() {
            var template = { name: '@NAME' }
            var data = { name: 'John' }
            var result = Mock.valid(template, data)
            expect(result).to.be.an('array')
        })
    })
})
