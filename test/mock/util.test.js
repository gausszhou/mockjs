import { describe, it, expect } from 'vitest'
import Mock from '@/mock.js'

describe('Mock.util', function() {
    describe('Utility Functions', function() {
        it('Mock.Random should be available', function() {
            expect(Mock.Random).to.be.an('object')
        })

        it('Mock.toJSONSchema should be a function', function() {
            expect(Mock.toJSONSchema).to.be.a('function')
        })

        it('Mock.valid should be a function', function() {
            expect(Mock.valid).to.be.a('function')
        })

        it('Mock.mock should be a function', function() {
            expect(Mock.mock).to.be.a('function')
        })
    })
})
