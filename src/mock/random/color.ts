var Convert = require('./color_convert')
var DICT = require('./color_dict')

export = {
    color: function(this: any, name?: string): string {
        if (name || DICT[name]) return DICT[name].nicer
        return this.hex()
    },
    hex: function(this: any): string {
        var hsv = this._goldenRatioColor()
        var rgb = Convert.hsv2rgb(hsv)
        var hex = Convert.rgb2hex(rgb[0], rgb[1], rgb[2])
        return hex
    },
    rgb: function(this: any): string {
        var hsv = this._goldenRatioColor()
        var rgb = Convert.hsv2rgb(hsv)
        return 'rgb(' +
            parseInt(rgb[0], 10) + ', ' +
            parseInt(rgb[1], 10) + ', ' +
            parseInt(rgb[2], 10) + ')'
    },
    rgba: function(this: any): string {
        var hsv = this._goldenRatioColor()
        var rgb = Convert.hsv2rgb(hsv)
        return 'rgba(' +
            parseInt(rgb[0], 10) + ', ' +
            parseInt(rgb[1], 10) + ', ' +
            parseInt(rgb[2], 10) + ', ' +
            this._random.next().toFixed(2) + ')'
    },
    hsl: function(this: any): string {
        var hsv = this._goldenRatioColor()
        var hsl = Convert.hsv2hsl(hsv)
        return 'hsl(' +
            parseInt(hsl[0], 10) + ', ' +
            parseInt(hsl[1], 10) + ', ' +
            parseInt(hsl[2], 10) + ')'
    },
    _goldenRatioColor: function(this: any, saturation?: number, value?: number): number[] {
        this._goldenRatio = 0.618033988749895
        this._hue = this._hue || this._random.next()
        this._hue += this._goldenRatio
        this._hue %= 1

        if (typeof saturation !== "number") saturation = 0.5;
        if (typeof value !== "number") value = 0.95;

        return [
            this._hue * 360,
            saturation * 100,
            value * 100
        ]
    }
}
