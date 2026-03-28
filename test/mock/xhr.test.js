import { describe, it, expect } from 'vitest'
import Mock from '@/mock.js'

describe('Mock.xhr', function() {
    describe('Mock.setup()', function() {
        it('should have setup method', function() {
            expect(Mock.setup).to.be.a('function')
        })
        it('should accept timeout setting', function() {
            var result = Mock.setup({
                timeout: 5000
            })
            expect(result).to.be.a('promise')
        })
    })
    describe('Mock.XHR', function() {
        it('should have XHR property', function() {
            expect(Mock).to.have.property('XHR')
        })
    })
})
