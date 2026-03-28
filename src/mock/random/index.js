/*
    ## Mock.Random
    
    工具类，用于生成各种随机数据。
*/

var Util = require('../util')

var Random = {
    extend: Util.extend,
    _random: new Util.Random(Date.now()),
    _seed: Date.now(),
    seed: function(seed) {
        Random._seed = seed
        Random._random = new Util.Random(seed)
        return Random
    },
    setSeed: function(seed) {
        return Random.seed(seed)
    },
    getSeed: function() {
        return Random._seed
    }
}

Random.extend(require('./basic'))
Random.extend(require('./date'))
Random.extend(require('./image'))
Random.extend(require('./color'))
Random.extend(require('./text'))
Random.extend(require('./name'))
Random.extend(require('./web'))
Random.extend(require('./address'))
Random.extend(require('./helper'))
Random.extend(require('./misc'))

module.exports = Random