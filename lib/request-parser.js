'use strict';
/**
 * Parses the request for SOAP attributes to work correctly
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

var RequestParser = function () {
    function RequestParser() {
        _classCallCheck(this, RequestParser);
    }

    _createClass(RequestParser, [{
        key: 'convertToValidAdwordsRequest',

        /**
         * Converts the Adwords Request to a valid request
         * Needed due to adwords WSDL not being 100% accurate
         * @access public
         * @param request {object} the request object for adwords
         * @return {object} the request object formatted correctly
         */
        value: function convertToValidAdwordsRequest(request) {
            return this.convertAttributeTypes(_.cloneDeep(request));
        }

        /**
         * Converts Attribute Types for the xsi:type field
         * @access private
         * @param object the request body
         * @return {object}
         */

    }, {
        key: 'convertAttributeTypes',
        value: function convertAttributeTypes(obj) {
            for (var key in obj) {
                var value = obj[key];
                if ('attributes' === key) {
                    continue;
                }

                if ('object' === typeof value) {
                    obj[key] = this.convertAttributeTypes(value);
                    continue;
                }

                if ('xsi:type' === key) {
                    obj.attributes = obj.attributes || {};
                    obj.attributes['xsi:type'] = value;
                    delete obj[key];
                }
            }
            return obj;
        }
    }]);

    return RequestParser;
}();

module.exports = new RequestParser();