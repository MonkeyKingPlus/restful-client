# restful-client

<!-- badge -->
[![npm version](https://img.shields.io/npm/v/mkp-restful-client.svg)](https://www.npmjs.com/package/mkp-restful-client)
[![npm license](https://img.shields.io/npm/l/mkp-restful-client.svg)](https://www.npmjs.com/package/mkp-restful-client)
[![npm download](https://img.shields.io/npm/dm/mkp-restful-client.svg)](https://www.npmjs.com/package/mkp-restful-client)
[![npm download](https://img.shields.io/npm/dt/mkp-restful-client.svg)](https://www.npmjs.com/package/mkp-restful-client)
<!-- endbadge -->

RESTful client with javascript,Redux is supported,you could use it in all of javascript projects especially React and React Native.

# Install
```bash
$ npm install mkp-restful-client --save
```

# Quick Start
```javascript
//import RESTful client
import RESTfulClient from "mkp-restful-client";
//initial RESTful client
//default client is fetch
let rest=new RESTfulClient();

window.$rest=rest;

//request a json
rest.request({
    url:"https://api.github.com/users/mralexgray/repos"
}).then(response=>{
    console.log(response);
})
```

# Client
There have two client fetch and superagent , fetch is default client.
```javascript
let rest=new RESTfulClient();
```
or
```javascript
let rest=new RESTfulClient({
	clientEngine:{
		name:"fetch",
		client:fetch
	}
});
```
code with superagent following
```javascript
import superagent from "superagent";
let rest=new RESTfulClient({
	clientEngine:{
		name:"superagent",
		client:superagent
	}
});
```

# RESTful client Events
* beforeSend(requestConf[,dispatch]) - invoke before request , you can override the request options in this time.
* sending(requestConf,xhr[,dispatch]) - immediately invoke when the request is sent. 
* received(requestConf,response,xhr[,dispatch]) - immediately invoke when the response is return.
* success(response[,dispatch]) - invoke when request is successful.
* error(err[,dispatch]) - invoke when request error is occurred.
* complete(requestConf[,dispatch]) - invoke when all of them is done.
* normalizeResponse(response) - normalize response
```javascript
let rest =new RESTfulClient({
	normalizeResponse(response){
		//you can override response 
		
		//example
		//return response.json().then(json=>{
		//	response.body=json;
		//	return response;
		//});
		//or
		//response.data=response.body.Data;
		//return response;
	},
    beforeSend(options, dispatch){
    	//you could override the opstions
    	//such as combine url
    	//options.url=host+options.url;
    	//do somethings
    },
    sending(options, xhr, dispatch){
    	//you could show a loading or store xhr and so on
    	//do somethings
    },
    received(options, response, xhr, dispatch){
    	//if show a loading at sending , you must remove that in here.
    	//do somethings
    },
    success(response, dispatch){
    	//how to read response header's values?
    	//example:
    	//response.header["HEADER_NAME"]
    	//in addtion you can read response.text , response.body and so on.
    	//you can inspect these property through console.
    	
    	//do somethings
    },
    error(err, dispatch){
    	//do somethings
    },
    complete(options, dispatch){
    	//do somethings
    }
})
```

# Methods
## request(requestConf[,dispatch])
the method will return a promise object.
* requestConf.url - request url
* requestConf.type - request method , the default value is 'get'.
* requestConf.headers - http headers
* requestConf.data - request data
* dispatch - you could specify the parameter when redux is available.

## get(url[,data,dispatch,ops={}])

## post(url[,data,dispatch,ops={}])
