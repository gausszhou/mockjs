/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from 'vitest'
import Mock from '../dist/mock'
declare var $: any

function stringify(json: any) {
    return JSON.stringify(json)
}

// Request tests need a browser-like environment (window, XHR, jQuery)
const hasBrowser = typeof Mock.XHR !== 'undefined'

if (hasBrowser) {
    describe('Request', () => {
        describe('jQuery.ajax()', () => {
            it('ajax GET', () => new Promise<void>((done) => {
                var url = Math.random()
                $.ajax({
                    url: url,
                    dataType: 'json'
                }).done(function() {
                }).fail(function(jqXHR: any) {
                    expect([404, 0]).toContain(jqXHR.status)
                }).always(function() {
                    done()
                })
            }))
        })
        describe('jQuery.getScript()', () => {
            it('getScript', () => new Promise<void>((done) => {
                var url = './materiels/noop.js'
                $.getScript(url, function(script: any, textStatus: string, jqXHR: any) {
                    expect(script).toBeTruthy()
                    done()
                })
            }))
        })
        describe('jQuery.load()', () => {
            it('load', () => new Promise<void>((done) => {
                var url = './materiels/noop.html'
                $('<div>').load(url, function(responseText: any) {
                    expect(responseText).toBeTruthy()
                    done()
                })
            }))
        })
        describe('jQuery.ajax() XHR Fields', () => {
            it('xhrFields', () => new Promise<void>((done) => {
                var url = Math.random()
                var xhr: any
                $.ajax({
                    xhr: function() {
                        xhr = $.ajaxSettings.xhr()
                        return xhr
                    },
                    url: url,
                    dataType: 'json',
                    xhrFields: {
                        timeout: 123,
                        withCredentials: true
                    }
                }).done(function() {
                }).fail(function(jqXHR: any) {
                    expect([404, 0]).toContain(jqXHR.status)
                    expect(xhr.timeout).toEqual(123)
                    expect(xhr.withCredentials).toEqual(true)
                }).always(function() {
                    done()
                })
            }))
        })
        describe('Mock.mock( rurl, template )', () => {
            it('rurl template', () => new Promise<void>((done) => {
                var url = 'rurl_template.json'
                Mock.mock(/rurl_template.json/, {
                    'list|1-10': [{ 'id|+1': 1, 'email': '@EMAIL' }]
                })
                Mock.setup({ timeout: '10-50' })
                $.ajax({
                    url: url,
                    dataType: 'json'
                }).done(function(data: any) {
                    expect(data).toHaveProperty('list')
                    expect(data.list).toBeTypeOf('object')
                    expect(data.list.length).toBeGreaterThanOrEqual(1)
                    expect(data.list.length).toBeLessThanOrEqual(10)
                    data.list.forEach(function(item: any, index: number, list: any[]) {
                        if (index > 0) expect(item.id).toEqual(list[index - 1].id + 1)
                    })
                }).fail(function(jqXHR: any, textStatus: string, errorThrown: any) {
                    console.log(jqXHR, textStatus, errorThrown)
                }).always(function() {
                    done()
                })
            }))
        })
        describe('Mock.mock( rurl, function(options) )', () => {
            it('rurl function', () => new Promise<void>((done) => {
                var url = 'rurl_function.json'
                Mock.mock(/rurl_function\.json/, function(options: any) {
                    expect(options).not.toBeUndefined()
                    expect(options.url).toEqual(url)
                    expect(options.type).toEqual('GET')
                    expect(options.body).toEqual(null)
                    return Mock.mock({
                        'list|1-10': [{ 'id|+1': 1, 'email': '@EMAIL' }]
                    })
                })
                $.ajax({
                    url: url,
                    dataType: 'json'
                }).done(function(data: any) {
                    expect(data).toHaveProperty('list')
                    expect(data.list).toBeTypeOf('object')
                    expect(data.list.length).toBeGreaterThanOrEqual(1)
                    expect(data.list.length).toBeLessThanOrEqual(10)
                    data.list.forEach(function(item: any, index: number, list: any[]) {
                        if (index > 0) expect(item.id).toEqual(list[index - 1].id + 1)
                    })
                }).fail(function(jqXHR: any, textStatus: string, errorThrown: any) {
                    console.log(jqXHR, textStatus, errorThrown)
                }).always(function() {
                    done()
                })
            }))
        })
        describe('Mock.mock( rurl, function(options) ) + GET + data', () => {
            it('GET with data', () => new Promise<void>((done) => {
                var url = 'rurl_function.json'
                Mock.mock(/rurl_function\.json/, function(options: any) {
                    expect(options).not.toBeUndefined()
                    expect(options.url).toEqual(url + '?foo=1')
                    expect(options.type).toEqual('GET')
                    expect(options.body).toEqual(null)
                    return Mock.mock({
                        'list|1-10': [{ 'id|+1': 1, 'email': '@EMAIL' }]
                    })
                })
                $.ajax({
                    url: url,
                    dataType: 'json',
                    data: { foo: 1 }
                }).done(function(data: any) {
                    expect(data).toHaveProperty('list')
                    expect(data.list).toBeTypeOf('object')
                    expect(data.list.length).toBeGreaterThanOrEqual(1)
                    expect(data.list.length).toBeLessThanOrEqual(10)
                    data.list.forEach(function(item: any, index: number, list: any[]) {
                        if (index > 0) expect(item.id).toEqual(list[index - 1].id + 1)
                    })
                }).fail(function(jqXHR: any, textStatus: string, errorThrown: any) {
                    console.log(jqXHR, textStatus, errorThrown)
                }).always(function() {
                    done()
                })
            }))
        })
        describe('Mock.mock( rurl, function(options) ) + POST + data', () => {
            it('POST with data', () => new Promise<void>((done) => {
                var url = 'rurl_function.json'
                Mock.mock(/rurl_function\.json/, function(options: any) {
                    expect(options).not.toBeUndefined()
                    expect(options.url).toEqual(url)
                    expect(options.type).toEqual('POST')
                    expect(options.body).toEqual('foo=1')
                    return Mock.mock({
                        'list|1-10': [{ 'id|+1': 1, 'email': '@EMAIL' }]
                    })
                })
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    data: { foo: 1 }
                }).done(function(data: any) {
                    expect(data).toHaveProperty('list')
                    expect(data.list).toBeTypeOf('object')
                    expect(data.list.length).toBeGreaterThanOrEqual(1)
                    expect(data.list.length).toBeLessThanOrEqual(10)
                    data.list.forEach(function(item: any, index: number, list: any[]) {
                        if (index > 0) expect(item.id).toEqual(list[index - 1].id + 1)
                    })
                }).fail(function(jqXHR: any, textStatus: string, errorThrown: any) {
                    console.log(jqXHR, textStatus, errorThrown)
                }).always(function() {
                    done()
                })
            }))
        })
        describe('Mock.mock( rurl, rtype, template )', () => {
            it('rurl rtype template', () => new Promise<void>((done) => {
                var url = 'rurl_rtype_template.json'
                var count = 0
                Mock.mock(/rurl_rtype_template\.json/, 'get', {
                    'list|1-10': [{ 'id|+1': 1, 'email': '@EMAIL', type: 'get' }]
                })
                Mock.mock(/rurl_rtype_template\.json/, 'post', {
                    'list|1-10': [{ 'id|+1': 1, 'email': '@EMAIL', type: 'post' }]
                })
                $.ajax({ url: url, type: 'get', dataType: 'json' })
                    .done(function(data: any) {
                        expect(data).toHaveProperty('list')
                        expect(data.list).toBeTypeOf('object')
                        expect(data.list.length).toBeGreaterThanOrEqual(1)
                        expect(data.list.length).toBeLessThanOrEqual(10)
                        data.list.forEach(function(item: any) {
                            expect(item).toHaveProperty('type', 'get')
                        })
                    }).done(success).always(complete)
                $.ajax({ url: url, type: 'post', dataType: 'json' })
                    .done(function(data: any) {
                        expect(data).toHaveProperty('list')
                        expect(data.list).toBeTypeOf('object')
                        expect(data.list.length).toBeGreaterThanOrEqual(1)
                        expect(data.list.length).toBeLessThanOrEqual(10)
                        data.list.forEach(function(item: any) {
                            expect(item).toHaveProperty('type', 'post')
                        })
                    }).done(success).always(complete)
                function success() { count++ }
                function complete() { if (count === 2) done() }
            }))
        })
        describe('Mock.mock( rurl, rtype, function(options) )', () => {
            it('rurl rtype function', () => new Promise<void>((done) => {
                var url = 'rurl_rtype_function.json'
                var count = 0
                Mock.mock(/rurl_rtype_function\.json/, /get/, function(options: any) {
                    expect(options).not.toBeUndefined()
                    expect(options.url).toEqual(url)
                    expect(options.type).toEqual('GET')
                    expect(options.body).toEqual(null)
                    return { type: 'get' }
                })
                Mock.mock(/rurl_rtype_function\.json/, /post|put/, function(options: any) {
                    expect(options).not.toBeUndefined()
                    expect(options.url).toEqual(url)
                    expect(['POST', 'PUT']).toContain(options.type)
                    expect(options.body).toEqual(null)
                    return { type: options.type.toLowerCase() }
                })
                $.ajax({ url: url, type: 'get', dataType: 'json' })
                    .done(function(data: any) { expect(data).toHaveProperty('type', 'get') })
                    .done(success).always(complete)
                $.ajax({ url: url, type: 'post', dataType: 'json' })
                    .done(function(data: any) { expect(data).toHaveProperty('type', 'post') })
                    .done(success).always(complete)
                $.ajax({ url: url, type: 'put', dataType: 'json' })
                    .done(function(data: any) { expect(data).toHaveProperty('type', 'put') })
                    .done(success).always(complete)
                function success() { count++ }
                function complete() { if (count === 3) done() }
            }))
        })
        describe('Mock.mock( rurl, rtype, function(options) ) + data', () => {
            it('rurl rtype function with data', () => new Promise<void>((done) => {
                var url = 'rurl_rtype_function.json'
                var count = 0
                Mock.mock(/rurl_rtype_function\.json/, /get/, function(options: any) {
                    expect(options).not.toBeUndefined()
                    expect(options.url).toEqual(url + '?foo=1')
                    expect(options.type).toEqual('GET')
                    expect(options.body).toEqual(null)
                    return { type: 'get' }
                })
                Mock.mock(/rurl_rtype_function\.json/, /post|put/, function(options: any) {
                    expect(options).not.toBeUndefined()
                    expect(options.url).toEqual(url)
                    expect(['POST', 'PUT']).toContain(options.type)
                    expect(options.body).toEqual('foo=1')
                    return { type: options.type.toLowerCase() }
                })
                $.ajax({ url: url, type: 'get', dataType: 'json', data: { foo: 1 } })
                    .done(function(data: any) { expect(data).toHaveProperty('type', 'get') })
                    .done(success).always(complete)
                $.ajax({ url: url, type: 'post', dataType: 'json', data: { foo: 1 } })
                    .done(function(data: any) { expect(data).toHaveProperty('type', 'post') })
                    .done(success).always(complete)
                $.ajax({ url: url, type: 'put', dataType: 'json', data: { foo: 1 } })
                    .done(function(data: any) { expect(data).toHaveProperty('type', 'put') })
                    .done(success).always(complete)
                function success() { count++ }
                function complete() { if (count === 3) done() }
            }))
        })
        describe('#105 addEventListener', () => {
            it('addEventListene => addEventListener', () => {
                var xhr = new Mock.XHR()
                expect(xhr.addEventListener).not.toBeUndefined()
                expect(xhr.addEventListene).toBeUndefined()
            })
        })
    })
} else {
    describe('Request', () => {
        it.skip('browser-only tests (skip in Node)', () => {})
    })
}
