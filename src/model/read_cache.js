import LRU from 'lru-cache'
import path from 'path'
import fs from 'fs-plus'
import _ from 'underscore'

export default class ReadCache {
  constructor (folder, cacheSize) {
    this.path = path.join(folder, 'Storage', 'db.json')
    this.cache = LRU({
      max: cacheSize,
      length: function (n) {
        return n.length
      }
    })
  }

  load () {
    var result = {}
    try {
      result = JSON.parse(fs.readFileSync(this.path, 'utf8'))
    } catch (e) {
      console.log(e)
    }

    if (result['read']) {
      _.each(result['read'].reverse(), function (val) {
        this.set(val)
      }, this)
    }
  }

  store () {
    var result = []
    this.cache.forEach(function (value, key) {
      result.push(key)
    })
    fs.writeFileSync(this.path, JSON.stringify({ read: result }), 'utf8')
  }

  set (val) {
    val = val.toString()
    return this.cache.set(val, val)
  }

  contains (val) {
    val = val.toString()
    return this.cache.has(val)
  }
}
