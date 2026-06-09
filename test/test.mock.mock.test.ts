import { describe, it, expect } from 'vitest'
import Mock from '../dist/mock'

describe('Mock.mock', () => {
    describe('Mock.mock( String )', () => {
        it('@EMAIL', () => {
            var data = Mock.mock('@EMAIL')
            expect(data).not.toEqual('@EMAIL')
        })
    })
    describe('Mock.mock( {} )', () => {
        it('list|1-10 [{id|+1, email}]', () => {
            var tpl = {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL'
                }]
            }
            var data = Mock.mock(tpl)
            expect(data).toHaveProperty('list')
            expect(data.list).toBeTypeOf('object')
            expect(data.list.length).toBeGreaterThanOrEqual(1)
            expect(data.list.length).toBeLessThanOrEqual(10)
            data.list.forEach(function(item: any, index: number, list: any[]) {
                if (index > 0) expect(item.id).toEqual(list[index - 1].id + 1)
            })
        })
    })
    describe('Mock.mock( function() )', () => {
        it('function returning template', () => {
            var fn = function() {
                return Mock.mock({
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                })
            }
            var data = Mock.mock(fn)
            expect(data).toHaveProperty('list')
            expect(data.list).toBeTypeOf('object')
            expect(data.list.length).toBeGreaterThanOrEqual(1)
            expect(data.list.length).toBeLessThanOrEqual(10)
            data.list.forEach(function(item: any, index: number, list: any[]) {
                if (index > 0) expect(item.id).toEqual(list[index - 1].id + 1)
            })
        })
    })
})
