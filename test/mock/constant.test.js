import { describe, it, expect } from 'vitest'
import Mock from '@/mock.js'

describe('Mock.constant', function() {
    describe('Constants', function() {
        it('Mock version should be defined', function() {
            expect(Mock).to.be.an('object')
        })
    })
})
