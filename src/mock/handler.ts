var Constant = require('./constant')
var Util = require('./util')
var Parser = require('./parser')
var Random = require('./random/')
var RE = require('./regexp')

var Handler: any = {
    extend: Util.extend
}

Handler.gen = function(template: any, name?: any, context?: any) {
    name = name == undefined ? '' : (name + '')

    context = context || {}
    context = {
            path: context.path || [Constant.GUID],
            templatePath: context.templatePath || [Constant.GUID++],
            currentContext: context.currentContext,
            templateCurrentContext: context.templateCurrentContext || template,
            root: context.root || context.currentContext,
            templateRoot: context.templateRoot || context.templateCurrentContext || template
        }

    var rule = Parser.parse(name)
    var type = Util.type(template)
    var data: any

    if (Handler[type]) {
        data = Handler[type]({
            type: type,
            template: template,
            name: name,
            parsedName: name ? name.replace(Constant.RE_KEY, '$1') : name,

            rule: rule,
            context: context
        })

        if (!context.root) context.root = data
        return data
    }

    return template
}

Handler.extend({
    array: function(options: any) {
        var result: any[] = [],
            i: number, ii: number;

        if (options.template.length === 0) return result

        if (!options.rule.parameters) {
            for (i = 0; i < options.template.length; i++) {
                options.context.path.push(i)
                options.context.templatePath.push(i)
                result.push(
                    Handler.gen(options.template[i], i, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })
                )
                options.context.path.pop()
                options.context.templatePath.pop()
            }
        } else {
            if (options.rule.min === 1 && options.rule.max === undefined) {
                options.context.path.push(options.name)
                options.context.templatePath.push(options.name)
                result = Random.pick(
                    Handler.gen(options.template, undefined, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })
                )
                options.context.path.pop()
                options.context.templatePath.pop()
            } else {
                if (options.rule.parameters[2]) {
                    options.template.__order_index = options.template.__order_index || 0

                    options.context.path.push(options.name)
                    options.context.templatePath.push(options.name)
                    result = Handler.gen(options.template, undefined, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })[
                        options.template.__order_index % options.template.length
                    ]

                    options.template.__order_index += +options.rule.parameters[2]

                    options.context.path.pop()
                    options.context.templatePath.pop()

                } else {
                    for (i = 0; i < options.rule.count; i++) {
                        for (ii = 0; ii < options.template.length; ii++) {
                            options.context.path.push(result.length)
                            options.context.templatePath.push(ii)
                            result.push(
                                Handler.gen(options.template[ii], result.length, {
                                    path: options.context.path,
                                    templatePath: options.context.templatePath,
                                    currentContext: result,
                                    templateCurrentContext: options.template,
                                    root: options.context.root || result,
                                    templateRoot: options.context.templateRoot || options.template
                                })
                            )
                            options.context.path.pop()
                            options.context.templatePath.pop()
                        }
                    }
                }
            }
        }
        return result
    },
    object: function(options: any) {
        var result: any = {},
            keys: any[], fnKeys: any[], key: string, parsedKey: string, inc: any, i: number;

        if (options.rule.min != undefined) {
            keys = Util.keys(options.template)
            keys = Random.shuffle(keys)
            keys = keys.slice(0, options.rule.count)
            for (i = 0; i < keys.length; i++) {
                key = keys[i]
                parsedKey = key.replace(Constant.RE_KEY, '$1')
                options.context.path.push(parsedKey)
                options.context.templatePath.push(key)
                result[parsedKey] = Handler.gen(options.template[key], key, {
                    path: options.context.path,
                    templatePath: options.context.templatePath,
                    currentContext: result,
                    templateCurrentContext: options.template,
                    root: options.context.root || result,
                    templateRoot: options.context.templateRoot || options.template
                })
                options.context.path.pop()
                options.context.templatePath.pop()
            }

        } else {
            keys = []
            fnKeys = []
            for (key in options.template) {
                (typeof options.template[key] === 'function' ? fnKeys : keys).push(key)
            }
            keys = keys.concat(fnKeys)

            for (i = 0; i < keys.length; i++) {
                key = keys[i]
                parsedKey = key.replace(Constant.RE_KEY, '$1')
                options.context.path.push(parsedKey)
                options.context.templatePath.push(key)
                result[parsedKey] = Handler.gen(options.template[key], key, {
                    path: options.context.path,
                    templatePath: options.context.templatePath,
                    currentContext: result,
                    templateCurrentContext: options.template,
                    root: options.context.root || result,
                    templateRoot: options.context.templateRoot || options.template
                })
                options.context.path.pop()
                options.context.templatePath.pop()
                inc = key.match(Constant.RE_KEY)
                if (inc && inc[2] && Util.type(options.template[key]) === 'number') {
                    options.template[key] += parseInt(inc[2], 10)
                }
            }
        }
        return result
    },
    number: function(options: any) {
        var result: any, parts: string[];
        if (options.rule.decimal) {
            options.template += ''
            parts = options.template.split('.')
            parts[0] = options.rule.range ? options.rule.count : parts[0]
            parts[1] = (parts[1] || '').slice(0, options.rule.dcount)
            while (parts[1].length < options.rule.dcount) {
                parts[1] += (
                    (parts[1].length < options.rule.dcount - 1) ? Random.character('number') : Random.character('123456789')
                )
            }
            result = parseFloat(parts.join('.'))
        } else {
            result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template
        }
        return result
    },
    boolean: function(options: any) {
        var result: any;
        result = options.rule.parameters ? Random.bool(options.rule.min, options.rule.max, options.template) : options.template
        return result
    },
    string: function(options: any) {
        var result: any = '',
            i: number, placeholders: any[], ph: string, phed: any;
        if (options.template.length) {

            if (options.rule.count == undefined) {
                result += options.template
            }

            for (i = 0; i < options.rule.count; i++) {
                result += options.template
            }
            placeholders = result.match(Constant.RE_PLACEHOLDER) || []
            for (i = 0; i < placeholders.length; i++) {
                ph = placeholders[i]

                if (/^\\/.test(ph)) {
                    placeholders.splice(i--, 1)
                    continue
                }

                phed = Handler.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext, options)

                if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) {
                    result = phed
                    break

                    if (Util.isNumeric(phed)) {
                        result = parseFloat(phed)
                        break
                    }
                    if (/^(true|false)$/.test(phed)) {
                        result = phed === 'true' ? true :
                            phed === 'false' ? false :
                            phed
                        break
                    }
                }
                result = result.replace(ph, phed)
            }

        } else {
            result = options.rule.range ? Random.string(options.rule.count) : options.template
        }
        return result
    },
    'function': function(options: any) {
        return options.template.call(options.context.currentContext, options)
    },
    'regexp': function(options: any) {
        var source = ''

        if (options.rule.count == undefined) {
            source += options.template.source
        }

        for (var i = 0; i < options.rule.count; i++) {
            source += options.template.source
        }

        return RE.Handler.gen(
            RE.Parser.parse(
                source
            )
        )
    }
})

Handler.extend({
    _all: function(this: any) {
        var re: any = {};
        for (var key in Random) re[key.toLowerCase()] = key
        return re
    },
    placeholder: function(placeholder: string, obj: any, templateContext: any, options: any) {
        Constant.RE_PLACEHOLDER.exec('')
        var parts = Constant.RE_PLACEHOLDER.exec(placeholder),
            key = parts && parts[1],
            lkey = key && key.toLowerCase(),
            okey = this._all()[lkey],
            params = parts && parts[2] || ''
        var pathParts = this.splitPathToArray(key)

        try {
            params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')')
        } catch (error) {
            params = parts[2].split(/,\s*/)
        }

        if (obj && (key in obj)) return obj[key]

        if (
            key.charAt(0) === '/' ||
            pathParts.length > 1
        ) return this.getValueByPath(key, options)

        if (templateContext &&
            (typeof templateContext === 'object') &&
            (key in templateContext) &&
            (placeholder !== templateContext[key])
        ) {
            templateContext[key] = Handler.gen(templateContext[key], key, {
                currentContext: obj,
                templateCurrentContext: templateContext
            })
            return templateContext[key]
        }

        if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder

        for (var i = 0; i < params.length; i++) {
            Constant.RE_PLACEHOLDER.exec('')
            if (Constant.RE_PLACEHOLDER.test(params[i])) {
                params[i] = Handler.placeholder(params[i], obj, templateContext, options)
            }
        }

        var handle = Random[key] || Random[lkey] || Random[okey]
        switch (Util.type(handle)) {
            case 'array':
                return Random.pick(handle)
            case 'function':
                handle.options = options
                var re = handle.apply(Random, params)
                if (re === undefined) re = ''
                delete handle.options
                return re
        }
    },
    getValueByPath: function(key: string, options: any) {
        var originalKey = key
        var keyPathParts = this.splitPathToArray(key)
        var absolutePathParts: any[] = []

        if (key.charAt(0) === '/') {
            absolutePathParts = [options.context.path[0]].concat(
                this.normalizePath(keyPathParts)
            )
        } else {
            if (keyPathParts.length > 1) {
                absolutePathParts = options.context.path.slice(0)
                absolutePathParts.pop()
                absolutePathParts = this.normalizePath(
                    absolutePathParts.concat(keyPathParts)
                )

            }
        }

        try {
            key = keyPathParts[keyPathParts.length - 1]
            var currentContext = options.context.root
            var templateCurrentContext = options.context.templateRoot
            for (var i = 1; i < absolutePathParts.length - 1; i++) {
                currentContext = currentContext[absolutePathParts[i]]
                templateCurrentContext = templateCurrentContext[absolutePathParts[i]]
            }
            if (currentContext && (key in currentContext)) return currentContext[key]

            if (templateCurrentContext &&
                (typeof templateCurrentContext === 'object') &&
                (key in templateCurrentContext) &&
                (originalKey !== templateCurrentContext[key])
            ) {
                templateCurrentContext[key] = Handler.gen(templateCurrentContext[key], key, {
                    currentContext: currentContext,
                    templateCurrentContext: templateCurrentContext
                })
                return templateCurrentContext[key]
            }
        } catch(err) { }

        return '@' + keyPathParts.join('/')
    },
    normalizePath: function(pathParts: any[]): any[] {
        var newPathParts: any[] = []
        for (var i = 0; i < pathParts.length; i++) {
            switch (pathParts[i]) {
                case '..':
                    newPathParts.pop()
                    break
                case '.':
                    break
                default:
                    newPathParts.push(pathParts[i])
            }
        }
        return newPathParts
    },
    splitPathToArray: function(path: string): string[] {
        var parts = path.split(/\/+/);
        if (!parts[parts.length - 1]) parts = parts.slice(0, -1)
        if (!parts[0]) parts = parts.slice(1)
        return parts;
    }
})

export = Handler
