/* @flow */

function buildQueryString(params: Object): string {
  const encodedParams: Array<string> = [];
  for (key in params) {
    if (params.hasOwnProperty(key)) {
      encodedParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
  }
  return encodedParams.join('&');
}

let sharedWoopra: Class<Woopra> = null;

/**
 * Used for tracking Woopra events for a specific domain.
 */
class Woopra {

  static shared(): Class<Woopra> {
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
  * @returns {Class<Woopra>} The affected Woopra instance.
  */
  config(options: Object): Class<Woopra> {
    Object.assign(this.options, options);
    return this;
  }

  /**
   * Merges given visitor properties with the current visitor properties.
   * By default visitor has no properties set.
   * @param {Object} visitor Properties to be merged.
   * @returns {Class<Woopra>} The affected Woopra instance.
   */
  identify(visitor: Object): Class<Woopra> {
    Object.assign(this._visitor, visitor);
    return this;
  }

  /**
   * Sends a visitor identification request. Used for sending visitor data
   * without having to track an event.
   * @returns {Promise} Request promise.
   */
  push(): Promise {
    return this._request('identify');
  }

  track(event: string, dimensions?: ?Object): Promise {
  }

  _request(endPoint: string, parameters?: ?Object): Promise {
    const protocol = this.options.ssl ? 'https' : 'http';
    const queryString = parameters ? `?${buildQueryString(parameters)}` : '';
    return fetch(`${protocol}://www.woopra.com/track/${endPoint}${queryString}`);
  }
}

module.exports = Woopra;
