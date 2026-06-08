var Util = require('../util')

var Random: any = {
    extend: Util.extend,
    _random: new Util.Random(Date.now()),
    _seed: Date.now(),
    seed: function(seed: number) {
        Random._seed = seed
        Random._random = new Util.Random(seed)
        basicModule._random = Random._random
        return Random
    },
    setSeed: function(seed: number) {
        return Random.seed(seed)
    },
    getSeed: function() {
        return Random._seed
    }
}

var basicModule = require('./basic')
basicModule._random = Random._random
Random.extend(basicModule)
Random.extend(require('./date'))
Random.extend(require('./image'))
Random.extend(require('./color'))
Random.extend(require('./text'))
Random.extend(require('./name'))
Random.extend(require('./web'))
Random.extend(require('./address'))
Random.extend(require('./helper'))
Random.extend(require('./misc'))

export = Random
