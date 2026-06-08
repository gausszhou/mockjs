var DICT = require('./address_dict')
export = {
    d4: function(this: any): number {
        return this.natural(1, 4)
    },
    d6: function(this: any): number {
        return this.natural(1, 6)
    },
    d8: function(this: any): number {
        return this.natural(1, 8)
    },
    d12: function(this: any): number {
        return this.natural(1, 12)
    },
    d20: function(this: any): number {
        return this.natural(1, 20)
    },
    d100: function(this: any): number {
        return this.natural(1, 100)
    },
    guid: function(this: any): string {
        var pool = "abcdefABCDEF1234567890",
            guid = this.string(pool, 8) + '-' +
            this.string(pool, 4) + '-' +
            this.string(pool, 4) + '-' +
            this.string(pool, 4) + '-' +
            this.string(pool, 12);
        return guid
    },
    uuid: function(this: any): string {
        return this.guid()
    },
    id: function(this: any): string {
        var id: string,
            sum = 0,
            rank = [
                "7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"
            ],
            last = [
                "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"
            ]

        id = this.pick(DICT).id +
            this.date('yyyyMMdd') +
            this.string('number', 3)

        for (var i = 0; i < id.length; i++) {
            sum += (id as any)[i] * (rank as any)[i];
        }
        id += last[sum % 11];

        return id
    },

    increment: function(this: any) {
        var key = 0
        return function(step?: number) {
            return key += (+step || 1)
        }
    }(),
    inc: function(this: any, step?: number): number {
        return this.increment(step)
    }
}
