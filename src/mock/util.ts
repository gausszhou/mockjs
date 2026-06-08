var Util: {
    extend: Function;
    each: Function;
    type: Function;
    isString: Function;
    isObject: Function;
    isArray: Function;
    isRegExp: Function;
    isFunction: Function;
    isObjectOrArray: Function;
    isNumeric: Function;
    keys: Function;
    values: Function;
    heredoc: Function;
    noop: Function;
    Random: any;
    [key: string]: any;
} = {} as any

Util.extend = function extend() {
    var target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        options, name, src, copy, clone

    if (length === 1) {
        target = this
        i = 0
    }

    for (; i < length; i++) {
        options = arguments[i]
        if (!options) continue

        for (name in options) {
            src = target[name]
            copy = options[name]

            if (target === copy) continue
            if (copy === undefined) continue

            if (Util.isArray(copy) || Util.isObject(copy)) {
                if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : []
                if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {}

                target[name] = Util.extend(clone, copy)
            } else {
                target[name] = copy
            }
        }
    }

    return target
}

Util.each = function each(obj: any, iterator: Function, context?: any) {
    var i: number, key: string
    if (this.type(obj) === 'number') {
        for (i = 0; i < obj; i++) {
            iterator(i, i)
        }
    } else if (obj.length === +obj.length) {
        for (i = 0; i < obj.length; i++) {
            if (iterator.call(context, obj[i], i, obj) === false) break
        }
    } else {
        for (key in obj) {
            if (iterator.call(context, obj[key], key, obj) === false) break
        }
    }
}

Util.type = function type(obj: any): string {
    return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)![1].toLowerCase()
}

Util.each('String Object Array RegExp Function'.split(' '), function(this: any, value: string) {
    Util['is' + value] = function(obj: any): boolean {
        return Util.type(obj) === value.toLowerCase()
    }
})

Util.isObjectOrArray = function(value: any): boolean {
    return Util.isObject(value) || Util.isArray(value)
}

Util.isNumeric = function(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value)
}

Util.keys = function(obj: any): string[] {
    var keys = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) keys.push(key)
    }
    return keys;
}
Util.values = function(obj: any): any[] {
    var values = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) values.push(obj[key])
    }
    return values;
}

Util.heredoc = function heredoc(fn: Function): string {
    return fn.toString()
        .replace(/^[^\/]+\/\*!?/, '')
        .replace(/\*\/[^\/]+$/, '')
        .replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '')
}

Util.noop = function() {}

Util.Random = function(this: any, seed?: number) {
    this.seed = seed !== undefined ? seed : Date.now()
}

Util.Random.prototype = {
    constructor: Util.Random,
    next: function(this: any): number {
        var t = this.seed += 0x6D2B79F5
        t = Math.imul(t ^ t >>> 15, t | 1)
        t ^= t + Math.imul(t ^ t >>> 7, t | 61)
        return ((t ^ t >>> 14) >>> 0) / 4294967296
    },
    nextInt: function(this: any, min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min
    }
}

export = Util
