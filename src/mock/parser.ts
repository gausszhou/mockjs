var Constant = require('./constant')
var Random = require('./random/')

export = {
    parse: function(name: any): any {
        name = name == undefined ? '' : (name + '')

        var parameters = (name || '').match(Constant.RE_KEY)

        var range = parameters && parameters[3] && parameters[3].match(Constant.RE_RANGE)
        var min = range && range[1] && parseInt(range[1], 10)
        var max = range && range[2] && parseInt(range[2], 10)
        var count = range ? !range[2] ? parseInt(range[1], 10) : Random.integer(min, max) : undefined

        var decimal = parameters && parameters[4] && parameters[4].match(Constant.RE_RANGE)
        var dmin = decimal && decimal[1] && parseInt(decimal[1], 10)
        var dmax = decimal && decimal[2] && parseInt(decimal[2], 10)
        var dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random.integer(dmin, dmax) : undefined

        var result = {
            parameters: parameters,
            range: range,
            min: min,
            max: max,
            count: count,
            decimal: decimal,
            dmin: dmin,
            dmax: dmax,
            dcount: dcount
        }

        for (var r in result) {
            if ((result as any)[r] != undefined) return result
        }

        return {}
    }
}
