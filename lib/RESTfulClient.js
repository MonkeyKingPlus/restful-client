"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function fetchRequest(client, options, dispatch) {
	var fetchOptions = {
		method: options.type.toUpperCase()
	};
	if (options.headers) {
		fetchOptions.headers = options.headers;
	}
	if (options.data) {
		fetchOptions.body = JSON.stringify(options.data);
	}
	client.ops.sending();
	return client.ops.clientEngine.client(options.url, fetchOptions).then(function (res) {
		client.ops.received(options, res, null, dispatch);
		client.ops.success(res, dispatch);
		client.ops.complete(options, dispatch);

		if (client.ops.normalizeResponse) {
			return client.ops.normalizeResponse(res);
		}
		return res;
	}).catch(function (ex) {
		client.ops.error(ex, dispatch);
	});
}

function superagentRequest(client, options, dispatch) {
	return new Promise(function (resolve, reject) {
		var req = client.ops.clientEngine.client[options.type.toLowerCase()](options.url);
		if (options.headers) {
			req.set(options.headers);
		}
		if (options.data) {
			if (options.type.toLowerCase() === "get") {
				req.query(options.data);
			} else {
				req.send(options.data);
			}
		}
		client.ops.sending(options, req, dispatch);
		req.end(function (err, response) {
			client.ops.received(options, response, req, dispatch);
			if (err) {
				client.ops.error(err, dispatch);
				reject(err);
			} else {
				client.ops.success(response, dispatch);
				if (client.ops.normalizeResponse) {
					var result = client.ops.normalizeResponse(response);
					if (result.then) {
						result.then(function (res) {
							resolve(res);
						});
					} else {
						resolve(result);
					}
				}
				resolve(response);
			}
			client.ops.complete(options, dispatch);
		});
	});
}

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

		if (!ops.clientEngine) {
			throw new Error("Please provide a client engine . such as fetch or superagent");
		}
		this.ops = Object.assign({
			normalizeResponse: null,
			/**
    * invoke before send. you can overwrite request options in this time.
    * @param {object} options - options is request options , you can be overridden
    * @param {function} dispatch
    * */
			beforeSend: function beforeSend(options, dispatch) {},

			/**
    * invoke when request is sending.
    * @param {object} options - request options
    * @param {XMLHttpRequest} xhr
    * @param {function} dispatch
    * */
			sending: function sending(options, xhr, dispatch) {},

			/**
    * immediately invoke when response is received.
    * @param {object} options - request options
    * @param {object} response
    * @param {XMLHttpRequest} xhr
    * @param {function} dispatch
    * */
			received: function received(options, response, xhr, dispatch) {},

			/**
    * invoke when the request is success.
    * @param {object} response
    * @param {funciton} dispatch
    * */
			success: function success(response, dispatch) {},

			/**
    * invoke when the request occur a error
    * @param {object} err
    * @param {function} dispatch
    * */
			error: function error(err, dispatch) {},

			/**
    * invoke when all of them is done.
    * @param {object} options - request options
    * @param {function} dispatch
    * */
			complete: function complete(options, dispatch) {}
		}, ops);
		if (!ops.clientEngine) {
			ops.clientEngine = {
				name: "fetch",
				client: fetch
			};
		}
	}

	/**
  * request
  * @param {object} conf - request options
  * @param {string} conf.url
  * @param {string} [conf.type=get]
  * @param {object} [headers={}] - http headers, default content-type's value will be set to "application/json;charset=utf-8" when conf.type is post
  * @param {object} conf.data - request data
  * @param {function} dispatch - optional , if you provide the parameter dispatch , you can know the network status from network status reducer.
  * */


	_createClass(RESTfulClient, [{
		key: "request",
		value: function request(conf, dispatch) {
			var options = Object.assign({}, conf);
			if (!options.type) {
				options.type = "get";
			}
			this.ops.beforeSend(options, dispatch);
			switch (this.ops.clientEngine.name.toLowerCase()) {
				case "superagent":
					return superagentRequest(this, options, dispatch);
				case "fetch":
				default:
					return fetchRequest(this, options, dispatch);
			}
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