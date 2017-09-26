'use strict';
/**
 * Adwords Reporting Module
 * Unfortunately, the adwords reporting is seperated from the rest of the sdk
 */

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

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

var request = require('request');
var util = require('util');
var fs = require('fs');
var AdwordsConstants = require('./constants');
var AdwordsReportBuilder = require('./report-builder');
var AdwordsAuth = require('./auth');

var AdwordsReport = function () {

    /**
     * @inheritDoc
     */
    function AdwordsReport(credentials) {
        _classCallCheck(this, AdwordsReport);

        this.auth = new AdwordsAuth(credentials);
        this.credentials = credentials;
    }

    /**
     * Gets a report from the api
     * @access public
     * @param apiVersion {string} the version in the api
     * @param report {object} the report object
     * @param callback {function}
     * @param retryRequest {boolean} used to determine if we need to retry the request
     *                               for internal use only
     */

    _createClass(AdwordsReport, [{
        key: 'getReport',
        value: function getReport(apiVersion, report, callback, retryRequest) {
            var _this = this;

            if (typeof retryRequest === 'undefined') {
                retryRequest = true;
            }

            report = report || {};
            apiVersion = apiVersion || AdwordsConstants.DEFAULT_ADWORDS_VERSION;

            this.getHeaders(report.additionalHeaders, function (error, headers) {
                if (error) {
                    return callback(error);
                }
                var b = new AdwordsReportBuilder();
                var xml = b.buildReport(report);
                request({
                    uri: 'https://adwords.google.com/api/adwords/reportdownload/' + apiVersion,
                    method: 'POST',
                    headers: headers,
                    form: {
                        '__rdxml': xml
                    }
                }, function (error, response, body) {
                    if (error || _this.reportBodyContainsError(report, body)) {
                        error = error || body;
                        if (-1 !== error.toString().indexOf(AdwordsConstants.OAUTH_ERROR) && retryRequest) {
                            _this.credentials.access_token = null;
                            return _this.getReport(apiVersion, report, callback, false);
                        }
                        return callback(error, null);
                    }
                    return callback(null, body);
                });
            });
        }

        /**
         * Determines if the body contains an error message
         * @param report {object} the report object
         * @param body {string} the body string
         * @return {boolean}
         */

    }, {
        key: 'reportBodyContainsError',
        value: function reportBodyContainsError(report, body) {
            if ('xml' !== ('' + report.format).toLowerCase() && -1 !== body.indexOf('<?xml')) {
                return true;
            }
            return false;
        }

        /**
         * Gets the headers for the request
         * @param additionalHeaders {object} gets additional headers
         */

    }, {
        key: 'getHeaders',
        value: function getHeaders(additionalHeaders, callback) {
            var _this2 = this;

            this.getAccessToken(function (error, accessToken) {
                if (error) {
                    return callback(error);
                }
                var headers = {
                    Authorization: 'Bearer ' + accessToken,
                    developerToken: _this2.credentials.developerToken,
                    clientCustomerId: _this2.credentials.clientCustomerId
                };
                (0, _assign2.default)(headers, additionalHeaders);
                return callback(null, headers);
            });
        }

        /**
         * Gets an access token
         * @access protected
         * @param callback {function}
         */

    }, {
        key: 'getAccessToken',
        value: function getAccessToken(callback) {
            var _this3 = this;

            if (this.credentials.access_token) {
                return callback(null, this.credentials.access_token);
            }

            this.auth.refreshAccessToken(this.credentials.refresh_token, function (error, tokens) {
                if (error) {
                    return callback(error);
                }
                _this3.credentials.access_token = tokens.access_token;
                callback(null, _this3.credentials.access_token);
            });
        }
    }]);

    return AdwordsReport;
}();

module.exports = AdwordsReport;