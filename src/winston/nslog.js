import nslog from 'nslog'
import moment from 'moment'
import _ from 'underscore'

export default class Nslog {
  constructor () {
    this.name = 'nslog'
  }

  log (level, msg, meta, callback) {
    var output = _.extend({ level: level, message: msg, timestamp: moment() }, meta)
    nslog(JSON.stringify(output))

    callback(null, true)
  }
}
