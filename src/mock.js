/* global window */
import Handler from './mock/handler'
import Util from './mock/util'
import Random from './mock/random'
import RE from './mock/regexp'
import toJSONSchema from './mock/schema'
import valid from './mock/valid'

let XHR
let xhrPromise

function getXHR() {
    if (typeof window === 'undefined') return Promise.resolve(undefined)
    if (XHR) return Promise.resolve(XHR)
    if (!xhrPromise) {
        xhrPromise = import('./mock/xhr').then(xhrModule => {
            XHR = xhrModule.default
            return XHR
        })
    }
    return xhrPromise
}

/*!
    Mock - 模拟请求 & 模拟数据
    https://github.com/nuysoft/Mock
    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
*/
const Mock = {
    Handler: Handler,
    Random: Random,
    Util: Util,
    XHR: XHR,
    RE: RE,
    toJSONSchema: toJSONSchema,
    valid: valid,
    heredoc: Util.heredoc,
    setup: function(settings) {
        return getXHR().then(xhr => xhr.setup(settings))
    },
    _mocked: {}
}

Mock.version = '1.0.1-beta3'

// 避免循环依赖
if (typeof window !== 'undefined') {
    getXHR().then(xhr => {
        if (xhr) {
            xhr.Mock = Mock
            Mock.XHR = xhr
        }
    })
}

/*
    * Mock.mock( template )
    * Mock.mock( function() )
    * Mock.mock( rurl, template )
    * Mock.mock( rurl, function(options) )
    * Mock.mock( rurl, rtype, template )
    * Mock.mock( rurl, rtype, function(options) )

    根据数据模板生成模拟数据。
*/
Mock.mock = function(rurl, rtype, template) {
    // Mock.mock(template)
    if (arguments.length === 1) {
        return Handler.gen(rurl)
    }
    // Mock.mock(rurl, template)
    if (arguments.length === 2) {
        template = rtype
        rtype = undefined
    }
    // 拦截 XHR - 异步加载
    getXHR().then(xhr => {
        if (xhr) window.XMLHttpRequest = xhr
    })
    Mock._mocked[rurl + (rtype || '')] = {
        rurl: rurl,
        rtype: rtype,
        template: template
    }
    return Mock
}

export default Mock