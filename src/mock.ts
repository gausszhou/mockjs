declare var window: any

var Handler = require('./mock/handler')
var Util = require('./mock/util')
var Random = require('./mock/random')
var RE = require('./mock/regexp')
var toJSONSchema = require('./mock/schema')
var valid = require('./mock/valid')

var XHR: any
if (typeof window !== 'undefined') XHR = require('./mock/xhr')

var Mock: any = {
    Handler: Handler,
    Random: Random,
    Util: Util,
    XHR: XHR,
    RE: RE,
    toJSONSchema: toJSONSchema,
    valid: valid,
    heredoc: Util.heredoc,
    setup: function(settings: any) {
        return XHR.setup(settings)
    },
    _mocked: {}
}

Mock.version = '1.0.1-beta3'

if (XHR) XHR.Mock = Mock

Mock.mock = function(rurl?: any, rtype?: any, template?: any) {
    if (arguments.length === 1) {
        return Handler.gen(rurl)
    }
    if (arguments.length === 2) {
        template = rtype
        rtype = undefined
    }
    if (XHR) window.XMLHttpRequest = XHR
    Mock._mocked[rurl + (rtype || '')] = {
        rurl: rurl,
        rtype: rtype,
        template: template
    }
    return Mock
}

export = Mock
