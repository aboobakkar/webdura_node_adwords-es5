'use strict';
/**
 * Adwords user
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

var util = require('util');
var _ = require('lodash');
var AdwordsServiceDescriptors = require('../services');
var AdwordsService = require('./service');
var AdwordsConstants = require('./constants');

var AdwordsUser = function () {

    /**
     * @inheritDoc
     */
    function AdwordsUser(obj) {
        _classCallCheck(this, AdwordsUser);

        this.credentials = _.extend({
            developerToken: '',
            userAgent: 'node-adwords',
            clientCustomerId: '',
            client_id: '',
            client_secret: '',
            refresh_token: '', //@todo implement refesh token instead of access token
            access_token: ''
        }, obj);
    }

    /**
     * Returns an Api Service Endpoint
     * @access public
     * @param service {string} the name of the service to load
     * @param adwordsversion {string} the adwords version, defaults to 201609
     * @return {AdwordsService} An adwords service object to call methods from
     */

    _createClass(AdwordsUser, [{
        key: 'getService',
        value: function getService(service, adwordsVersion) {
            adwordsVersion = adwordsVersion || AdwordsConstants.DEFAULT_ADWORDS_VERSION;
            var serviceDescriptor = AdwordsServiceDescriptors[service];
            if (!serviceDescriptor) {
                throw new Error(util.format('No Service Named %s in %s of the adwords api', service, adwordsVersion));
            }

            var service = new AdwordsService(this.credentials, this.populateServiceDescriptor(serviceDescriptor, adwordsVersion));

            return service;
        }

        /**
         * Populates the service descriptor with dynamic values
         * @access protected
         * @param serviceDescriptor {object} the obejct from the service descriptor object
         * @param adwordsVersion {string} the adwords version to replace inside the service descriptors
         * @return {object} a new service descriptor with the proper versioning
         */

    }, {
        key: 'populateServiceDescriptor',
        value: function populateServiceDescriptor(serviceDescriptor, adwordsVersion) {
            var finalServiceDescriptor = _.clone(serviceDescriptor);
            for (var index in finalServiceDescriptor) {
                if ('string' === typeof finalServiceDescriptor[index]) {
                    finalServiceDescriptor[index] = finalServiceDescriptor[index].replace(/\{\{version\}\}/g, adwordsVersion);
                }
            }
            return finalServiceDescriptor;
        }
    }]);

    return AdwordsUser;
}();

module.exports = AdwordsUser;