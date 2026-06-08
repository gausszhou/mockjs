var DICT = require('./address_dict')
var REGION = ['东北', '华北', '华东', '华中', '华南', '西南', '西北']

export = {
    region: function(this: any): string {
        return this.pick(REGION)
    },
    province: function(this: any): string {
        return this.pick(DICT).name
    },
    city: function(this: any, prefix?: boolean): string {
        var province = this.pick(DICT)
        var city = this.pick(province.children)
        return prefix ? [province.name, city.name].join(' ') : city.name
    },
    county: function(this: any, prefix?: boolean): string {
        var province = this.pick(DICT)
        var city = this.pick(province.children)
        var county = this.pick(city.children) || {
            name: '-'
        }
        return prefix ? [province.name, city.name, county.name].join(' ') : county.name
    },
    zip: function(this: any, len?: number): string {
        var zip = ''
        for (var i = 0; i < (len || 6); i++) zip += this.natural(0, 9)
        return zip
    }
}
