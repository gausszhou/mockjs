import { describe, it, expect } from 'vitest'
import Mock from '../src/mock.js'

describe('Mock.mock', function() {
    describe('Mock.mock( String )', function() {
        it('generates email from placeholder', function() {
            var data = Mock.mock('@EMAIL')
            expect(data).to.not.equal('@EMAIL')
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
    })
})
