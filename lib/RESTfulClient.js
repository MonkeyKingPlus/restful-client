"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RESTful client
 * @class
 * */
var RESTfulClient = function () {
	/**
  * @constructor
  * @param {object} ops
  * @param {function} [ops.beforeSend=noop]
  * @param {function} [ops.sending=noop]
  * @param {function} [ops.received=noop]
  * @param {function} [ops.success=noop]
  * @param {function} [ops.error=noop]
  * @param {function} [ops.complete=noop]
  * */
	function RESTfulClient() {
		var ops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, RESTfulClient);

		this.ops = Object.assign({
			/**
    * It is calling before send. you can overwrite request options in this time.
    * @param {object} options - options is ref request options
    * @param {function} dispatch
    * */
			beforeSend: function beforeSend(options, dispatch) {},

			/**
    * It is fired when request is sending.
    * the beginRequest action is invoked by default and the parameter dispatch is provided.
    * @param {object} options - request options
    * @param {XMLHttpRequest} xhr
    * @param {function} dispatch
    * */
			sending: function sending(options, xhr, dispatch) {},

			/**
    * It is fired when response is received right now.
    * the endRequest action is invoked by default and the parameter dispatch is provided.
    * @param {object} options - request options
    * @param {object} response
    * @param {XMLHttpRequest} xhr
    * @param {function} dispatch
    * */
			received: function received(options, response, xhr, dispatch) {},

			/**
    * It is fired when the request have any error.
    * @param {object} response
    * @param {funciton} dispatch
    * */
			success: function success(response, dispatch) {},

			/**
    * It is fired when error occur
    * @param {object} err
    * @param {function} dispatch
    * */
			error: function error(err, dispatch) {},

			/**
    * It is fired when all is done
    * @param {object} options - current request options
    * @param {function} dispatch
    * */
			complete: function complete(options, dispatch) {}
		}, ops);
	}

	/**
  * request
  * @param {object} conf - request options
  * @param {string} conf.url - url is required
  * @param {string} [conf.type=get] - request method
  * @param {boolean} [conf.canAbort=false] - marking the request can be terminated.
  * @param {object} [headers={}] - http headers, default content-type's value will be set to "application/json;utf-8" when conf.type is post
  * @param {object} conf.data - request data
  * @param {function} dispatch - optional , if you provide the parameter dispatch , you can know the network status from network status reducer.
  * */


	_createClass(RESTfulClient, [{
		key: "request",
		value: function request(conf, dispatch) {
			var _this = this;

			var options = Object.assign({
				canAbort: false
			}, conf);
			if (!options.type) {
				options.type = "get";
			} else {
				options.type = options.type.toLowerCase();
			}
			// options.url = `${$config.APIHost}${conf.url}`;
			if (!options.headers) {
				options.headers = {};
			}
			if (options.type === "post") {
				options.headers["content-type"] = "application/json;utf-8";
			}
			this.ops.beforeSend(options, dispatch);
			return new Promise(function (resolve, reject) {
				var req = _superagent2.default[options.type](options.url).set(options.headers);
				_this.ops.sending(options, req, dispatch);
				if (options.data) {
					if (options.type === "get") {
						req.query(options.data);
					} else {
						req.send(options.data);
					}
				}
				req.end(function (err, response) {
					_this.ops.received(options, response, req, dispatch);
					if (err) {
						_this.ops.error(err, dispatch);
						reject(err);
					} else {
						_this.ops.success(response, dispatch);
						resolve(response);
					}
					_this.ops.complete(options, dispatch);
				});
			});
		}
	}, {
		key: "get",
		value: function get(url, data, dispatch) {
			var ops = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

			var conf = Object.assign({
				url: url,
				data: data,
				type: "get"
			}, ops);
			return this.request(conf, dispatch);
		}
	}, {
		key: "post",
		value: function post(url, data, dispatch) {
			var ops = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

			var conf = Object.assign({
				url: url,
				data: data,
				type: "post"
			}, ops);
			return this.request(conf, dispatch);
		}
	}]);

	return RESTfulClient;
}();

exports.default = RESTfulClient;