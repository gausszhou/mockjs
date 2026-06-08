export = {
    boolean: function(this: any, min?: any, max?: any, cur?: any): boolean {
        if (cur !== undefined) {
            min = typeof min !== 'undefined' && !isNaN(min) ? parseInt(min, 10) : 1
            max = typeof max !== 'undefined' && !isNaN(max) ? parseInt(max, 10) : 1
            return this._random.next() > 1.0 / (min + max) * min ? !cur : cur
        }

        return this._random.next() >= 0.5
    },
    bool: function(this: any, min?: any, max?: any, cur?: any): boolean {
        return this.boolean(min, max, cur)
    },
    natural: function(this: any, min?: any, max?: any): number {
        min = typeof min !== 'undefined' ? parseInt(min, 10) : 0
        max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992
        return Math.round(this._random.next() * (max - min)) + min
    },
    integer: function(this: any, min?: any, max?: any): number {
        min = typeof min !== 'undefined' ? parseInt(min, 10) : -9007199254740992
        max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992
        return Math.round(this._random.next() * (max - min)) + min
    },
    int: function(this: any, min?: any, max?: any): number {
        return this.integer(min, max)
    },
    float: function(this: any, min?: any, max?: any, dmin?: any, dmax?: any): number {
        dmin = dmin === undefined ? 0 : dmin
        dmin = Math.max(Math.min(dmin, 17), 0)
        dmax = dmax === undefined ? 17 : dmax
        dmax = Math.max(Math.min(dmax, 17), 0)
        var ret = this.integer(min, max) + '.';
        for (var i = 0, dcount = this.natural(dmin, dmax); i < dcount; i++) {
            ret += (
                (i < dcount - 1) ? this.character('number') : this.character('123456789')
            )
        }
        return parseFloat(ret)
    },
    character: function(this: any, pool?: any): string {
        var pools: any = {
            lower: 'abcdefghijklmnopqrstuvwxyz',
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            number: '0123456789',
            symbol: '!@#$%^&*()[]'
        }
        pools.alpha = pools.lower + pools.upper
        pools['undefined'] = pools.lower + pools.upper + pools.number + pools.symbol

        pool = pools[('' + pool).toLowerCase()] || pool
        return pool.charAt(this.natural(0, pool.length - 1))
    },
    char: function(this: any, pool?: any): string {
        return this.character(pool)
    },
    string: function(this: any, pool?: any, min?: any, max?: any): string {
        var len: number
        switch (arguments.length) {
            case 0:
                len = this.natural(3, 7)
                break
            case 1:
                len = pool
                pool = undefined
                break
            case 2:
                if (typeof arguments[0] === 'string') {
                    len = min
                } else {
                    len = this.natural(pool, min)
                    pool = undefined
                }
                break
            case 3:
                len = this.natural(min, max)
                break
        }

        var text = ''
        for (var i = 0; i < len; i++) {
            text += this.character(pool)
        }

        return text
    },
    str: function(this: any, ...args: any[]): string {
        return this.string.apply(this, args)
    },
    range: function(start?: any, stop?: any, step?: any): number[] {
        if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
        }
        step = arguments[2] || 1;

        start = +start
        stop = +stop
        step = +step

        var len = Math.max(Math.ceil((stop - start) / step), 0);
        var idx = 0;
        var range = new Array(len);

        while (idx < len) {
            range[idx++] = start;
            start += step;
        }

        return range;
    }
}
