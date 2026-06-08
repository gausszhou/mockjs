var Util = require('../util')

export = {
    capitalize: function(word: string): string {
        return (word + '').charAt(0).toUpperCase() + (word + '').substr(1)
    },
    upper: function(str: string): string {
        return (str + '').toUpperCase()
    },
    lower: function(str: string): string {
        return (str + '').toLowerCase()
    },
    pick: function pick(this: any, arr: any, min?: any, max?: any): any {
        if (!Util.isArray(arr)) {
            arr = [].slice.call(arguments)
            min = 1
            max = 1
        } else {
            if (min === undefined) min = 1

            if (max === undefined) max = min
        }

        if (min === 1 && max === 1) return arr[this.natural(0, arr.length - 1)]

        return this.shuffle(arr, min, max)
    },
    shuffle: function shuffle(this: any, arr?: any, min?: any, max?: any): any {
        arr = arr || []
        var old = arr.slice(0),
            result = [],
            index = 0,
            length = old.length;
        for (var i = 0; i < length; i++) {
            index = this.natural(0, old.length - 1)
            result.push(old[index])
            old.splice(index, 1)
        }
        switch (arguments.length) {
            case 0:
            case 1:
                return result
            case 2:
                max = min
            case 3:
                min = parseInt(min, 10)
                max = parseInt(max, 10)
                return result.slice(0, this.natural(min, max))
        }
        return result
    },
    order: function order(this: any, array: any): any {
        var orderFn = order as any
        orderFn.cache = orderFn.cache || {}

        if (arguments.length > 1) array = [].slice.call(arguments, 0)

        var options = orderFn.options
        var templatePath = options.context.templatePath.join('.')

        var cache = (
            orderFn.cache[templatePath] = orderFn.cache[templatePath] || {
                index: 0,
                array: array
            }
        )

        return cache.array[cache.index++ % cache.array.length]
    }
}
