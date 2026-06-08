var Util = require('../util')
var Random = require('../random/')

var Handler: any = {
    extend: Util.extend
}

var LOWER = ascii(97, 122)
var UPPER = ascii(65, 90)
var NUMBER = ascii(48, 57)
var OTHER = ascii(32, 47) + ascii(58, 64) + ascii(91, 96) + ascii(123, 126)
var PRINTABLE = ascii(32, 126)
var SPACE = ' \f\n\r\t\v\u00A0\u2028\u2029'
var CHARACTER_CLASSES: any = {
    '\\w': LOWER + UPPER + NUMBER + '_',
    '\\W': OTHER.replace('_', ''),
    '\\s': SPACE,
    '\\S': function() {
        var result = PRINTABLE
        for (var i = 0; i < SPACE.length; i++) {
            result = result.replace(SPACE[i], '')
        }
        return result
    }(),
    '\\d': NUMBER,
    '\\D': LOWER + UPPER + OTHER
}

function ascii(from: number, to: number): string {
    var result = ''
    for (var i = from; i <= to; i++) {
        result += String.fromCharCode(i)
    }
    return result
}

Handler.gen = function(node: any, result?: any, cache?: any) {
    cache = cache || {
        guid: 1
    }
    return Handler[node.type] ? Handler[node.type](node, result, cache) :
        Handler.token(node, result, cache)
}

Handler.extend({
    token: function(node: any, result: any, cache: any) {
        switch (node.type) {
            case 'start':
            case 'end':
                return ''
            case 'any-character':
                return Random.character()
            case 'backspace':
                return ''
            case 'word-boundary':
                return ''
            case 'non-word-boundary':
                break
            case 'digit':
                return Random.pick(
                    NUMBER.split('')
                )
            case 'non-digit':
                return Random.pick(
                    (LOWER + UPPER + OTHER).split('')
                )
            case 'form-feed':
                break
            case 'line-feed':
                return node.body || node.text
            case 'carriage-return':
                break
            case 'white-space':
                return Random.pick(
                    SPACE.split('')
                )
            case 'non-white-space':
                return Random.pick(
                    (LOWER + UPPER + NUMBER).split('')
                )
            case 'tab':
                break
            case 'vertical-tab':
                break
            case 'word':
                return Random.pick(
                    (LOWER + UPPER + NUMBER).split('')
                )
            case 'non-word':
                return Random.pick(
                    OTHER.replace('_', '').split('')
                )
            case 'null-character':
                break
        }
        return node.body || node.text
    },
    alternate: function(node: any, result: any, cache: any) {
        return this.gen(
            Random.boolean() ? node.left : node.right,
            result,
            cache
        )
    },
    match: function(node: any, result: any, cache: any) {
        result = ''
        for (var i = 0; i < node.body.length; i++) {
            result += this.gen(node.body[i], result, cache)
        }
        return result
    },
    'capture-group': function(node: any, result: any, cache: any) {
        result = this.gen(node.body, result, cache)
        cache[cache.guid++] = result
        return result
    },
    'non-capture-group': function(node: any, result: any, cache: any) {
        return this.gen(node.body, result, cache)
    },
    'positive-lookahead': function(node: any, result: any, cache: any) {
        return this.gen(node.body, result, cache)
    },
    'negative-lookahead': function(node: any, result: any, cache: any) {
        return ''
    },
    quantified: function(node: any, result: any, cache: any) {
        result = ''
        var count = this.quantifier(node.quantifier);
        for (var i = 0; i < count; i++) {
            result += this.gen(node.body, result, cache)
        }
        return result
    },
    quantifier: function(node: any, result: any, cache: any) {
        var min = Math.max(node.min, 0)
        var max = isFinite(node.max) ? node.max :
            min + Random.integer(3, 7)
        return Random.integer(min, max)
    },
    charset: function(node: any, result: any, cache: any) {
        if (node.invert) return this['invert-charset'](node, result, cache)

        var literal = Random.pick(node.body)
        return this.gen(literal, result, cache)
    },
    'invert-charset': function(node: any, result: any, cache: any) {
        var pool = PRINTABLE
        for (var i = 0, item: any; i < node.body.length; i++) {
            item = node.body[i]
            switch (item.type) {
                case 'literal':
                    pool = pool.replace(item.body, '')
                    break
                case 'range':
                    var min = this.gen(item.start, result, cache).charCodeAt()
                    var max = this.gen(item.end, result, cache).charCodeAt()
                    for (var ii = min; ii <= max; ii++) {
                        pool = pool.replace(String.fromCharCode(ii), '')
                    }
                default:
                    var characters = CHARACTER_CLASSES[item.text]
                    if (characters) {
                        for (var iii = 0; iii <= characters.length; iii++) {
                            pool = pool.replace(characters[iii], '')
                        }
                    }
            }
        }
        return Random.pick(pool.split(''))
    },
    range: function(node: any, result: any, cache: any) {
        var min = this.gen(node.start, result, cache).charCodeAt()
        var max = this.gen(node.end, result, cache).charCodeAt()
        return String.fromCharCode(
            Random.integer(min, max)
        )
    },
    literal: function(node: any, result: any, cache: any) {
        return node.escaped ? node.body : node.text
    },
    unicode: function(node: any, result: any, cache: any) {
        return String.fromCharCode(
            parseInt(node.code, 16)
        )
    },
    hex: function(node: any, result: any, cache: any) {
        return String.fromCharCode(
            parseInt(node.code, 16)
        )
    },
    octal: function(node: any, result: any, cache: any) {
        return String.fromCharCode(
            parseInt(node.code, 8)
        )
    },
    'back-reference': function(node: any, result: any, cache: any) {
        return cache[node.code] || ''
    },
    CONTROL_CHARACTER_MAP: function() {
        var CONTROL_CHARACTER = '@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _'.split(' ')
        var CONTROL_CHARACTER_UNICODE = '\u0000 \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \u0008 \u0009 \u000A \u000B \u000C \u000D \u000E \u000F \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001A \u001B \u001C \u001D \u001E \u001F'.split(' ')
        var map: any = {}
        for (var i = 0; i < CONTROL_CHARACTER.length; i++) {
            map[CONTROL_CHARACTER[i]] = CONTROL_CHARACTER_UNICODE[i]
        }
        return map
    }(),
    'control-character': function(node: any, result: any, cache: any) {
        return this.CONTROL_CHARACTER_MAP[node.code]
    }
})

export = Handler
