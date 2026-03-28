/*
    ## Mock.Random
    
    工具类，用于生成各种随机数据。
*/

import Util from '../util'
import basic from './basic'
import date from './date'
import image from './image'
import color from './color'
import text, { init as initText } from './text'
import name from './name'
import web from './web'
import address from './address'
import helper from './helper'
import misc from './misc'

const Random = {
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

Random.extend(basic)
Random.extend(date)
Random.extend(image)
Random.extend(color)
Random.extend(name)
Random.extend(web)
Random.extend(address)
Random.extend(helper)
Random.extend(misc)
Random.extend(text)

// Initialize text module with Random reference
initText(Random)

export default Random