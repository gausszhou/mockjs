var Constant = require('../constant')
var Util = require('../util')
var Parser = require('../parser')

function toJSONSchema(template: any, name?: any, path?: any[]): any {
    path = path || []
    var result: any = {
        name: typeof name === 'string' ? name.replace(Constant.RE_KEY, '$1') : name,
        template: template,
        type: Util.type(template),
        rule: Parser.parse(name)
    }
    result.path = path.slice(0)
    result.path.push(name === undefined ? 'ROOT' : result.name)

    switch (result.type) {
        case 'array':
            result.items = []
            Util.each(template, function(value: any, index: any) {
                result.items.push(
                    toJSONSchema(value, index, result.path)
                )
            })
            break
        case 'object':
            result.properties = []
            Util.each(template, function(value: any, name: any) {
                result.properties.push(
                    toJSONSchema(value, name, result.path)
                )
            })
            break
    }

    return result
}

export = toJSONSchema
