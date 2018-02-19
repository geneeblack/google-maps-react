import React from 'react'
import ReactDOM from 'react-dom'

import {ScriptCache} from './lib/ScriptCache'
import GoogleApi from './lib/GoogleApi'

const defaultMapConfig = {}
const defaultCreateCache = (options) => {
    options = options || {};
    const client = options.client;
    const channel = options.channel;
    const apiKey = options.apiKey;
    const libraries = options.libraries || ['places'];
    const version = options.version || '3.32';
    const language = options.language || 'en';

    return ScriptCache({
        google: GoogleApi({
            channel: channel,
            client: client,
            apiKey: apiKey,
            language: language,
            libraries: libraries,
            version: version
        })
    });
};

export const wrapper = (options) => (WrappedComponent) => {
    const client = options.client;
    const channel = options.channel;
    const apiKey = options.apiKey;
    const libraries = options.libraries || ['drawing', 'places', 'geometry'];
    const version = options.version || '3.32';
    const createCache = options.createCache || defaultCreateCache;

    class Wrapper extends React.Component {
        constructor(props, context) {
            super(props, context);

            this.scriptCache = createCache(options);
            this.scriptCache.google.onLoad(this.onLoad.bind(this))

            this.state = {
                loaded: false,
                map: null,
                google: null
            }
        }

        onLoad(err, tag) {
            this._gapi = window.google;

            this.setState({loaded: true, google: this._gapi})
        }

        render() {
            const props = Object.assign({}, this.props, {
                loaded: this.state.loaded,
                google: window.google
            });

            return (
                <div>
                    <WrappedComponent {...props}/>
                    <div ref='map'/>
                </div>
            )
        }
    }

    return Wrapper;
}

export default wrapper;
