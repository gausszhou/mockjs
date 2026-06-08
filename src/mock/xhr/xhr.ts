declare var window: any
declare var document: any
declare var Event: any

var Util = require('../util')

window._XMLHttpRequest = window.XMLHttpRequest
window._ActiveXObject = window.ActiveXObject

try {
    new window.Event('custom')
} catch (exception) {
    window.Event = function(type: string, bubbles?: any, cancelable?: any, detail?: any) {
        var event = document.createEvent('CustomEvent')
        event.initCustomEvent(type, bubbles, cancelable, detail)
        return event
    }
}

var XHR_STATES: any = {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4
}

var XHR_EVENTS = 'readystatechange loadstart progress abort error load timeout loadend'.split(' ')
var XHR_REQUEST_PROPERTIES = 'timeout withCredentials'.split(' ')
var XHR_RESPONSE_PROPERTIES = 'readyState responseURL status statusText responseType response responseText responseXML'.split(' ')

var HTTP_STATUS_CODES: any = {
    100: "Continue",
    101: "Switching Protocols",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    300: "Multiple Choice",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Request Entity Too Large",
    414: "Request-URI Too Long",
    415: "Unsupported Media Type",
    416: "Requested Range Not Satisfiable",
    417: "Expectation Failed",
    422: "Unprocessable Entity",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported"
}

var MockXMLHttpRequest: any = function MockXMLHttpRequest(this: any) {
    this.custom = {
        events: {},
        requestHeaders: {},
        responseHeaders: {}
    }
}

MockXMLHttpRequest._settings = {
    timeout: '10-100',
}

MockXMLHttpRequest.setup = function(settings: any) {
    Util.extend(MockXMLHttpRequest._settings, settings)
    return MockXMLHttpRequest._settings
}

Util.extend(MockXMLHttpRequest, XHR_STATES)
Util.extend(MockXMLHttpRequest.prototype, XHR_STATES)

MockXMLHttpRequest.prototype.mock = true
MockXMLHttpRequest.prototype.match = false

Util.extend(MockXMLHttpRequest.prototype, {
    open: function(this: any, method: string, url: string, async?: any, username?: string, password?: string) {
        var that = this

        Util.extend(this.custom, {
            method: method,
            url: url,
            async: typeof async === 'boolean' ? async : true,
            username: username,
            password: password,
            options: {
                url: url,
                type: method
            }
        })

        this.custom.timeout = function(timeout: any) {
            if (typeof timeout === 'number') return timeout
            if (typeof timeout === 'string' && timeout.indexOf('-') === -1) return parseInt(timeout, 10)
            if (typeof timeout === 'string' && timeout.indexOf('-') !== -1) {
                var tmp = timeout.split('-')
                var min = parseInt(tmp[0], 10)
                var max = parseInt(tmp[1], 10)
                return Math.round(Math.random() * (max - min)) + min
            }
            return timeout
        }(MockXMLHttpRequest._settings.timeout)

        var item = find(this.custom.options)

        function handle(event: any) {
            for (var i = 0; i < XHR_RESPONSE_PROPERTIES.length; i++) {
                try {
                    that[XHR_RESPONSE_PROPERTIES[i]] = xhr[XHR_RESPONSE_PROPERTIES[i]]
                } catch (e) {}
            }
            that.dispatchEvent(new Event(event.type))
        }

        if (!item) {
            var xhr = createNativeXMLHttpRequest()
            this.custom.xhr = xhr

            for (var i = 0; i < XHR_EVENTS.length; i++) {
                xhr.addEventListener(XHR_EVENTS[i], handle)
            }

            if (username) xhr.open(method, url, async, username, password)
            else xhr.open(method, url, async)

            for (var j = 0; j < XHR_REQUEST_PROPERTIES.length; j++) {
                try {
                    xhr[XHR_REQUEST_PROPERTIES[j]] = that[XHR_REQUEST_PROPERTIES[j]]
                } catch (e) {}
            }

            return
        }

        this.match = true
        this.custom.template = item
        this.readyState = MockXMLHttpRequest.OPENED
        this.dispatchEvent(new Event('readystatechange'))
    },
    setRequestHeader: function(this: any, name: string, value: string) {
        if (!this.match) {
            this.custom.xhr.setRequestHeader(name, value)
            return
        }

        var requestHeaders = this.custom.requestHeaders
        if (requestHeaders[name]) requestHeaders[name] += ',' + value
        else requestHeaders[name] = value
    },
    timeout: 0,
    withCredentials: false,
    upload: {},
    send: function send(this: any, data: any) {
        var that = this
        this.custom.options.body = data

        if (!this.match) {
            this.custom.xhr.send(data)
            return
        }

        this.setRequestHeader('X-Requested-With', 'MockXMLHttpRequest')

        this.dispatchEvent(new Event('loadstart'))

        if (this.custom.async) setTimeout(done, this.custom.timeout)
        else done()

        function done() {
            that.readyState = MockXMLHttpRequest.HEADERS_RECEIVED
            that.dispatchEvent(new Event('readystatechange'))
            that.readyState = MockXMLHttpRequest.LOADING
            that.dispatchEvent(new Event('readystatechange'))

            that.status = 200
            that.statusText = HTTP_STATUS_CODES[200]

            that.response = that.responseText = JSON.stringify(
                convert(that.custom.template, that.custom.options),
                null, 4
            )

            that.readyState = MockXMLHttpRequest.DONE
            that.dispatchEvent(new Event('readystatechange'))
            that.dispatchEvent(new Event('load'));
            that.dispatchEvent(new Event('loadend'));
        }
    },
    abort: function abort(this: any) {
        if (!this.match) {
            this.custom.xhr.abort()
            return
        }

        this.readyState = MockXMLHttpRequest.UNSENT
        this.dispatchEvent(new Event('abort', false, false, this))
        this.dispatchEvent(new Event('error', false, false, this))
    }
})

Util.extend(MockXMLHttpRequest.prototype, {
    responseURL: '',
    status: MockXMLHttpRequest.UNSENT,
    statusText: '',
    getResponseHeader: function(this: any, name: string) {
        if (!this.match) {
            return this.custom.xhr.getResponseHeader(name)
        }

        return this.custom.responseHeaders[name.toLowerCase()]
    },
    getAllResponseHeaders: function(this: any) {
        if (!this.match) {
            return this.custom.xhr.getAllResponseHeaders()
        }

        var responseHeaders = this.custom.responseHeaders
        var headers = ''
        for (var h in responseHeaders) {
            if (!responseHeaders.hasOwnProperty(h)) continue
            headers += h + ': ' + responseHeaders[h] + '\r\n'
        }
        return headers
    },
    overrideMimeType: function() {},
    responseType: '',
    response: null,
    responseText: '',
    responseXML: null
})

Util.extend(MockXMLHttpRequest.prototype, {
    addEventListener: function addEventListener(this: any, type: string, handle: Function) {
        var events = this.custom.events
        if (!events[type]) events[type] = []
        events[type].push(handle)
    },
    removeEventListener: function removeEventListener(this: any, type: string, handle: Function) {
        var handles = this.custom.events[type] || []
        for (var i = 0; i < handles.length; i++) {
            if (handles[i] === handle) {
                handles.splice(i--, 1)
            }
        }
    },
    dispatchEvent: function dispatchEvent(this: any, event: any) {
        var handles = this.custom.events[event.type] || []
        for (var i = 0; i < handles.length; i++) {
            handles[i].call(this, event)
        }

        var ontype = 'on' + event.type
        if (this[ontype]) this[ontype](event)
    }
})

function createNativeXMLHttpRequest(): any {
    var isLocal = function() {
        var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
        var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
        var ajaxLocation = location.href
        var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
        return rlocalProtocol.test(ajaxLocParts[1])
    }()

    return window.ActiveXObject ?
        (!isLocal && createStandardXHR() || createActiveXHR()) : createStandardXHR()

    function createStandardXHR() {
        try {
            return new window._XMLHttpRequest();
        } catch (e) {}
    }

    function createActiveXHR() {
        try {
            return new window._ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
    }
}

function find(options: any): any {
    for (var sUrlType in MockXMLHttpRequest.Mock._mocked) {
        var item = MockXMLHttpRequest.Mock._mocked[sUrlType]
        if (
            (!item.rurl || match(item.rurl, options.url)) &&
            (!item.rtype || match(item.rtype, options.type.toLowerCase()))
        ) {
            return item
        }
    }

    function match(expected: any, actual: string): boolean {
        if (Util.type(expected) === 'string') {
            return expected === actual
        }
        if (Util.type(expected) === 'regexp') {
            return expected.test(actual)
        }
        return false
    }

}

function convert(item: any, options: any): any {
    return Util.isFunction(item.template) ?
        item.template(options) : MockXMLHttpRequest.Mock.mock(item.template)
}

export = MockXMLHttpRequest
