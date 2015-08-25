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
    this._visitor = {};
  }

  /**
  * Merges given options with the current configuration options.
  * The default configuration is { ssl: true }
  * @param {Object} options Options to be merged.
  * @returns {Woopra} The affected Woopra instance.
  */
  config(options/* : Object*/)/* : Class<Woopra>*/ {
    Object.assign(this.options, options);
    return this;
  }

  /**
   * Merges given visitor properties with the current visitor properties.
   * By default visitor has no properties set.
   * @param {Object} visitor Properties to be merged.
   * @returns {Woopra} The affected Woopra instance.
   */
  identify(visitor/* : Object*/)/* : Class<Woopra>*/ {
    Object.assign(this._visitor, visitor);
    return this;
  }

  push()/* : Promise*/ {
  }

  track(event/* : string*/, dimensions?/* : ?Object*/)/* : Promise*/ {
  }

  _request(endPoint/* : string*/, parameters?/* : ?Object*/)/* : Promise*/ {
    const protocol = this.options.ssl ? 'https' : 'http';
    const queryString = parameters ? `?${buildQueryString(parameters)}` : '';
    return fetch(`${protocol}://www.woopra.com/track/${endPoint}${queryString}`);
  }
}

module.exports = Woopra;
