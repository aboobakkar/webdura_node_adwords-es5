'use strict';

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;(0, _defineProperty2.default)(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var AdwordsAuth = function () {

    /**
     * @inheritDoc
     */
    function AdwordsAuth(credentials, redirectUrl) {
        _classCallCheck(this, AdwordsAuth);

        this.credentials = credentials;
        this.oauth2Client = new OAuth2(this.credentials.client_id, this.credentials.client_secret, redirectUrl);
    }

    /**
     * Generates an Authentication Url
     * @access public
     * @return {string} a URL to redirect to
     */

    _createClass(AdwordsAuth, [{
        key: 'generateAuthenticationUrl',
        value: function generateAuthenticationUrl() {
            return this.oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: 'https://www.googleapis.com/auth/adwords'
            });
        }

        /**
         * Gets an access+refresh token from an authorization code
         * @access public
         * @param code {string} a coded string
         * @param callback {function}
         */

    }, {
        key: 'getAccessTokenFromAuthorizationCode',
        value: function getAccessTokenFromAuthorizationCode(code, callback) {
            this.oauth2Client.getToken(code, callback);
        }

        /**
         * Refreshes the access token
         * @access public
         * @param refreshToken {string} a refresh token
         * @param callback {function} a function with error and the new access token
         */

    }, {
        key: 'refreshAccessToken',
        value: function refreshAccessToken(refreshToken, callback) {
            this.oauth2Client.setCredentials({
                refresh_token: refreshToken
            });
            this.oauth2Client.refreshAccessToken(callback);
        }
    }]);

    return AdwordsAuth;
}();

module.exports = AdwordsAuth;