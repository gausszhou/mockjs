import { describe, it, expect } from 'vitest'
import Mock from '../../src/mock.js'

describe('Mock.parser', function() {
    describe('Template Parsing', function() {
        it('parses string template', function() {
            var data = Mock.mock('@EMAIL')
            expect(data).to.be.a('string')
            expect(data).to.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        })

        it('parses object template with rules', function() {
            var data = Mock.mock({
                'list|1-10': [{
                    'id|+1': 1
                }]
            })
            expect(data.list).to.be.an('array')
            expect(data.list.length).to.be.within(1, 10)
        })

        it('parses nested object template', function() {
            var data = Mock.mock({
                'user': {
                    'name': '@NAME',
                    'age|18-60': 1
                }
            })
            expect(data.user).to.be.an('object')
            expect(data.user.name).to.be.a('string')
            expect(data.user.age).to.be.a('number')
        })
    })
})
