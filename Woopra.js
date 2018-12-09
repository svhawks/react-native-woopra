/* @flow */

function buildQueryString(params: {}): string {
  const encodedParams: Array<string> = [];
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      encodedParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
  }
  return encodedParams.join('&');
}

export type Options = {
  ssl: boolean,
  [key: string]: ?(string|boolean|number),
};

export type Visitor = {
  id?: string,
  email?: string,
  cookie?: string,
  [key: string]: ?(string|boolean|number),
};

export type GenericKVContainer = {
  [key: string]: ?(string|boolean|number),
};

type RequestParameters = {
  event: string,
  eventData: GenericKVContainer,
};

type FinalRequestParameters = {
  website: string,
  eventData?: ?GenericKVContainer,
  [key: string]: ?(string|boolean|number),
};

let sharedWoopra: ?Woopra = null;

/**
 * Used for tracking Woopra events for a specific domain.
 */
export default class Woopra {
  domain: ?string = null;
  options: Options = { ssl: true };

  _visitor: Visitor = {};
  _client: GenericKVContainer = {};

  static shared(): Woopra {
    if (!sharedWoopra) sharedWoopra = new Woopra();
    return sharedWoopra;
  }

  constructor() {
    // Do nothing.
  }

  /**
  * Merges given options with the current configuration options.
  * The default configuration is { ssl: true }
  * @param {Options} options Options to be merged.
  * @returns {Woopra} The affected Woopra instance.
  */
  config(options: Options): Woopra {
    Object.assign(this.options, options);
    return this;
  }

  /**
   * Merges given visitor properties with the current visitor properties.
   * By default visitor has no properties set. You need to set a value
   * for `email`, `id`, or `cookie` to uniquely identify a visitor.
   * @param {Visitor} visitor Properties to be merged.
   * @returns {Woopra} The affected Woopra instance.
   */
  identify(visitor: Visitor): Woopra {
    Object.assign(this._visitor, visitor);
    return this;
  }

  /**
   * Merges given client properties with the current client properties.
   * By default client has no properties set.
   * @param {GenericKVContainer} properties Properties to be merged.
   * @returns {Woopra} The affected Woopra instance.
   */
  client(properties: GenericKVContainer): Woopra {
    Object.assign(this._client, properties);
    return this;
  }

  /**
   * Sends a visitor identification request. Used for sending visitor data
   * without having to track an event.
   * @returns {Promise} Request promise.
   */
  push(): Promise<any> {
    return this._request('identify');
  }

  /**
   * Sends an event tracking request.
   * @param {string} event Event name.
   * @param {GenericKVContainer} dimensions Event data.
   * @param {GenericKVContainer} extraParameters Extra parameters (e.g. timestamp)
   * @returns {Promise} Request promise.
   */
  track(event: string, dimensions?: ?GenericKVContainer, extraParameters?: ?GenericKVContainer): Promise<any> {
    const eventData = dimensions || {};
    const parameters = { event, eventData };
    if (extraParameters) Object.assign(parameters, extraParameters);
    return this._request('ce', parameters);
  }

  _request(endPoint: string, parameters?: ?RequestParameters): Promise<any> {
    if (!this.domain) {
      throw new Error('Woopra object must have its domain property set.');
    }
    if (!this._visitor.id && !this._visitor.email && !this._visitor.cookie) {
      throw new Error('Visitor must have `email`, `id`, or `cookie` property set.');
    }
    const protocol = this.options.ssl ? 'https' : 'http';
    const finalParameters: FinalRequestParameters = { website: this.domain };
    Object.assign(finalParameters, this._client);
    Object.assign(finalParameters, Object.keys(this._visitor).reduce((previous, key) => {
      previous[`cv_${key}`] = this._visitor[key];
      return previous;
    }, {}));
    Object.assign(finalParameters, parameters || {});
    if (finalParameters.eventData) {
      const eventData = finalParameters.eventData;
      delete finalParameters.eventData;
      Object.assign(finalParameters, Object.keys(eventData).reduce((previous, key) => {
        previous[`ce_${key}`] = eventData[key];
        return previous;
      }, {}));
    }
    return fetch(`${protocol}://www.woopra.com/track/${endPoint}?${buildQueryString(finalParameters)}`);
  }
}
