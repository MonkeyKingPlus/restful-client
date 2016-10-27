import agent from "superagent";

/**
 * RESTful client
 * @class
 * */
export default class RESTfulClient {
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
	constructor(ops = {}) {
		this.ops = Object.assign({
			/**
			 * invoke before send. you can overwrite request options in this time.
			 * @param {object} options - options is request options , you can be overridden
			 * @param {function} dispatch
			 * */
			beforeSend(options, dispatch){
			},
			/**
			 * invoke when request is sending.
			 * @param {object} options - request options
			 * @param {XMLHttpRequest} xhr
			 * @param {function} dispatch
			 * */
			sending(options, xhr, dispatch){
			},
			/**
			 * immediately invoke when response is received.
			 * @param {object} options - request options
			 * @param {object} response
			 * @param {XMLHttpRequest} xhr
			 * @param {function} dispatch
			 * */
			received(options, response, xhr, dispatch){
			},
			/**
			 * invoke when the request is success.
			 * @param {object} response
			 * @param {funciton} dispatch
			 * */
			success(response, dispatch){
			},
			/**
			 * invoke when the request occur a error
			 * @param {object} err
			 * @param {function} dispatch
			 * */
			error(err, dispatch){
			},
			/**
			 * invoke when all of them is done.
			 * @param {object} options - request options
			 * @param {function} dispatch
			 * */
			complete(options, dispatch){
			}
		}, ops)
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
	request(conf, dispatch) {
		let options = Object.assign({}, conf);
		if (!options.type) {
			options.type = "get";
		}
		else {
			options.type = options.type.toLowerCase();
		}
		if (!options.headers) {
			options.headers = {};
		}
		if (options.type === "post") {
			if(!options.headers["content-type"]) {
				options.headers["content-type"] = "application/json;charset=utf-8";
			}
		}
		this.ops.beforeSend(options, dispatch);
		return new Promise((resolve, reject)=> {
			let req = agent[options.type](options.url).set(options.headers);
			this.ops.sending(options, req, dispatch);
			if (options.data) {
				if(options.type==="get"){
					req.query(options.data);
				}
				else{
					req.send(options.data);
				}
			}
			req.end((err, response)=> {
				this.ops.received(options, response, req, dispatch);
				if (err) {
					this.ops.error(err, dispatch);
					reject(err);
				}
				else {
					this.ops.success(response, dispatch);
					resolve(response);
				}
				this.ops.complete(options, dispatch);
			});
		});
	}

	get(url, data, dispatch,ops={}) {
		let conf=Object.assign({
			url,
			data,
			type: "get"
		},ops);
		return this.request(conf, dispatch);
	}

	post(url, data, dispatch,ops={}) {
		let conf=Object.assign({
			url,
			data,
			type: "post"
		},ops);
		return this.request(conf, dispatch);
	}
}
