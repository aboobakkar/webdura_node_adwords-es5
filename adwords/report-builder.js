'use strict';
/**
 * Helper class to help build a report
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

var builder = require('xmlbuilder');
var moment = require('moment');

var AdwordsReportBuilder = function () {
    function AdwordsReportBuilder() {
        _classCallCheck(this, AdwordsReportBuilder);
    }

    _createClass(AdwordsReportBuilder, [{
        key: 'buildReport',

        /**
         * Builds a report
         * @access public
         * @param report {object}
         */
        value: function buildReport(report) {
            var xml = builder.create('reportDefinition');
            this.buildSelector(xml, report);
            xml.ele('reportName', {}, report.reportName);
            xml.ele('reportType', {}, report.reportType);
            xml.ele('dateRangeType', {}, 'CUSTOM_DATE');
            xml.ele('downloadFormat', {}, report.format);
            return xml.end();
        }

        /**
         * Builds the fields list in the selector. This function modifies the xmlelement
         * @param fields {array} Array of field names
         * @access private
         * @return null
         */

    }, {
        key: 'buildSelector',
        value: function buildSelector(xml, report) {
            var selector = xml.ele('selector');
            this.buildFields(selector, report.fields);
            this.buildFilters(selector, report.filters);
            this.buildDateRange(selector, report.startDate, report.endDate);
        }

        /**
         * Builds the fields
         * @access private
         * @param selector {xml}
         * @param fields {array}
         */

    }, {
        key: 'buildFields',
        value: function buildFields(selector, fields) {
            for (var index in fields) {
                selector.ele('fields', {}, fields[index]);
            }
        }

        /**
         * Builds the date range
         * @access private
         * @param selector {xml}
         * @param startDate {date}
         * @param endDate {date}
         */

    }, {
        key: 'buildDateRange',
        value: function buildDateRange(selector, startDate, endDate) {
            var dateElement = selector.ele('dateRange');
            dateElement.ele('min', {}, moment(new Date(startDate)).format('YYYYMMDD'));
            dateElement.ele('max', {}, moment(new Date(endDate)).format('YYYYMMDD'));
        }

        /**
         * Builds the Filters
         * @param selector {xml}
         * @param filters {array} an array of filters
         */

    }, {
        key: 'buildFilters',
        value: function buildFilters(selector, filters) {
            for (var index in filters) {
                var filter = filters[index];
                var element = selector.ele('predicates');
                element.ele('field', {}, filter.field);
                element.ele('operator', {}, filter.operator);
                if (!(filter.values instanceof Array)) {
                    filter.values = [filter.values];
                }
                for (var r in filter.values) {
                    element.ele('values', {}, filter.values[r]);
                }
            }
        }
    }]);

    return AdwordsReportBuilder;
}();

module.exports = AdwordsReportBuilder;