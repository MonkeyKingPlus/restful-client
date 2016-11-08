type requestOption={
	type:String,
	data:Object,
	url:String,
	headers:Object
};

function formatRequestOption(clientName:String,requestOption:requestOption){
	switch (clientName.toLowerCase()){
		case "fetch":
			requestOption.type=requestOption.type.toUpperCase();

		default:
			return requestOption;
	}
}

function fetchRequest(client:RESTfulClient,options:requestOption,dispatch:Function){
	let fetchOptions={
		method:options.type.toUpperCase()
	};
	if(options.headers){
		fetchOptions.headers=options.headers;
	}
	if(options.data){
		fetchOptions.body=JSON.stringify(options.data);
	}
	client.ops.sending();
	return client.ops.clientEngine.client(options.url,fetchOptions).then(res=>{
		client.ops.received(options, res, null, dispatch);
		client.ops.success(res, dispatch);
		client.ops.complete(options, dispatch);
		return res;
	}).catch(ex=>{
		client.ops.error(ex,dispatch);
	});
}

function superagentRequest(client:RESTfulClient,options:requestOption,dispatch:Function){
	return new Promise((resolve,reject)=>{
		let req=client.ops.clientEngine.client[options.type.toLowerCase()](options.url);
		if(options.headers) {
			req.set(options.headers);
		}
		if (options.data) {
			if(options.type.toLowerCase()==="get"){
				req.query(options.data);
			}
			else{
				req.send(options.data);
			}
		}
		client.ops.sending(options, req, dispatch);
		req.end((err, response)=> {
			client.ops.received(options, response, req, dispatch);
			if (err) {
				client.ops.error(err, dispatch);
				reject(err);
			}
			else {
				client.ops.success(response, dispatch);
				resolve(response);
			}
			client.ops.complete(options, dispatch);
		});
	})
}

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
			},
			clientEngine:{
				name:"fetch",
				client:fetch
			}
		}, ops);
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
		this.ops.beforeSend(options, dispatch);
		switch (this.ops.clientEngine.name.toLowerCase()){
			case "superagent":
				return superagentRequest(this,options,dispatch);
			case "fetch":
			default:
				return fetchRequest(this,options,dispatch);
		}
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
