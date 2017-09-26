'use strict';
/**
 * Adwords Service Object
 * This object acts as many adwords objects
 */

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

var _ = require('lodash');
var soap = require('soap');
var async = require('async');
var AdwordsAuth = require('./auth');
var AdwordsConstants = require('./constants');
var AdwordsRequestParser = require('../lib/request-parser');

var AdwordsService = function () {

    /**
     * @inheritDoc
     */
    function AdwordsService(credentials, serviceDescriptor) {
        _classCallCheck(this, AdwordsService);

        this.credentials = credentials;
        this.auth = new AdwordsAuth(credentials);
        this.serviceDescriptor = serviceDescriptor;
        this.registerServiceDescriptorMethods(this.serviceDescriptor.methods);
    }

    /**
     * Attaches a function to the current service object
     * This is sort of like using the "Proxy.create" method
     * but have to wait till it is finalized in ES6
     * @access protected
     * @param methods {array} an array of string method names
     */

    _createClass(AdwordsService, [{
        key: 'registerServiceDescriptorMethods',
        value: function registerServiceDescriptorMethods(methods) {
            for (var index in methods) {
                var method = methods[index];
                this[method] = this.callServiceMethod(method);
            }
        }

        /**
         * Helper method to call the service properly
         * @access private
         * @param method {string} the method name for the service
         * @return {function} returns a service call method to invoke.
         */

    }, {
        key: 'callServiceMethod',
        value: function callServiceMethod(method) {
            return _.bind(function () {
                var payload = AdwordsRequestParser.convertToValidAdwordsRequest(arguments[0] || []);
                var callback = arguments[1] || function () {};
                this.callService(method, payload, callback, true);
            }, this);
        }

        /**
         * The bread and butter method that calls the adwords service.
         * This method should never be called directly
         * @access protected
         * @param method {string} the method to call e.g. `get` or `mutate`
         * @param payload {object} the request object to send to adwords
         * @param callback {function}
         * @param shouldRetry {boolean} should retry if there is an oAuth error
         */

    }, {
        key: 'callService',
        value: function callService(method, payload, callback, shouldRetry) {
            var _this = this;

            async.parallel([this.getClient.bind(this), this.getAccessToken.bind(this)], function (error) {
                if (error) {
                    return callback(error);
                }

                _this.client.setSecurity(new soap.BearerSecurity(_this.credentials.access_token));

                _this.client[method](payload, _this.parseResponse(function (error, response) {
                    if (error && shouldRetry && -1 !== error.toString().indexOf(AdwordsConstants.OAUTH_ERROR)) {
                        _this.credentials.access_token = null;
                        return _this.callService(method, payload, callback, false);
                    }
                    callback(error, response);
                }));
            });
        }

        /**
         * Parses the response from adwords
         * @access protected
         * @param callback
         * @return {function} a function that returns a parsed response
         */

    }, {
        key: 'parseResponse',
        value: function parseResponse(callback) {
            return function (error, response) {
                callback(error, response && response.rval || response);
            };
        }

        /**
         * Helper method to get the SOAP client
         * @access protected
         * @param callback {function} returns a function with error, soapclient and meta data
         */

    }, {
        key: 'getClient',
        value: function getClient(callback) {
            var _this2 = this;

            if (this.client && this.clientDetails) {
                return callback(null, this.client, this.clientDetails);
            }

            soap.createClient(this.serviceDescriptor.wsdl, function (error, client) {
                if (error) {
                    return callback(error);
                }

                _this2.client = client;
                _this2.client.on('request', function (request) {
                    return _this2.log('request', request);
                });
                _this2.client.on('response', function (response) {
                    return _this2.log('response', response);
                });
                _this2.client.on('soapError', function (error) {
                    return _this2.log('soapError', error);
                });

                var clientDetails = {};
                clientDetails.description = _this2.client.describe();
                clientDetails.namespace = 'ns1';
                clientDetails.name = _.keys(clientDetails.description)[0];
                clientDetails.port = _.keys(clientDetails.description[clientDetails.name])[0];
                clientDetails.methods = _.keys(clientDetails.description[clientDetails.name][clientDetails.port]);
                _this2.clientDetails = clientDetails;

                var headers = {
                    developerToken: _this2.credentials.developerToken,
                    userAgent: _this2.credentials.userAgent,
                    validateOnly: !!_this2.credentials.validateOnly
                };

                if (_this2.credentials.clientCustomerId) {
                    headers.clientCustomerId = _this2.credentials.clientCustomerId;
                }

                _this2.client.addSoapHeader({
                    RequestHeader: headers
                }, _this2.clientDetails.name, _this2.clientDetails.namespace, _this2.serviceDescriptor.xmlns);

                return callback(null, _this2.client, _this2.clientDetails);
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

        /**
         * Helper method to log all the soap calls
         * @access private
         */

    }, {
        key: 'log',
        value: function log() {
            if (this.credentials.debug) {
                console.log(arguments);
            }
        }
    }]);

    return AdwordsService;
}();

module.exports = AdwordsService;