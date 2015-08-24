/* @flow */

function buildQueryString(params/* : Object*/)/* : string*/ {

}

let sharedWoopra/* : Class<Woopra>*/ = null;

/**
 * Used for tracking Woopra events for a specific domain.
 */
class Woopra {

  static shared()/* : Class<Woopra>*/ {
    if (!sharedWoopra) sharedWoopra = new Woopra();
    return sharedWoopra;
  }

  constructor() {
    this.domain = null;
    this.options = { ssl: true };
  }

  /**
  * Merges given options with the current configuration options.
  * @param {Object} options Options to be merged.
  * @returns {Woopra} The affected Woopra instance.
  */
  config(options/* : Object*/)/* : Class<Woopra>*/ {
    Object.assign(this.options, options);
    return this;
  }

  request(endPoint/* : string*/, parameters?/* : ?Object*/)/* : Promise*/ {
    const protocol = this.options.ssl ? 'https' : 'http';
    const queryString = parameters ? `?${buildQueryString(parameters)}` : '';
    return fetch(`${protocol}://www.woopra.com/track/${endPoint}${queryString}`);
  }

  identify(visitor/* : Object*/)/* : Class<Woopra>*/ {
  }

  push()/* : Promise*/ {
  }

  track(event/* : string*/, dimensions?/* : ?Object*/)/* : Promise*/ {
  }
}

module.exports = Woopra;
